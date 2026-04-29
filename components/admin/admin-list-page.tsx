"use client";

import AdminTable from "@/components/admin/admin-table";
import PageHeading from "@/components/admin/page-heading";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

type AdminListPageProps = {
  addHref?: string;
  columns: string[];
  description: string;
  rows: Array<Array<React.ReactNode>> | (() => Promise<Array<Array<React.ReactNode>>>);
  title: string;
  onEdit?: (rowIndex: number) => void;
  onDelete?: (rowIndex: number) => void;
};

const getSearchableText = (node: React.ReactNode): string => {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getSearchableText).join(" ");
  }

  if (typeof node === "object" && "props" in node) {
    return getSearchableText(node.props?.children);
  }

  return "";
};

const AdminListPage: React.FC<AdminListPageProps> = ({
  addHref,
  columns,
  description,
  rows,
  title,
  onEdit,
  onDelete,
}) => {
  const rowsAreAsync = typeof rows === "function";
  const [tableRows, setTableRows] = useState<Array<Array<React.ReactNode>>>(
    rowsAreAsync ? [] : rows
  );
  const [loading, setLoading] = useState(rowsAreAsync);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!rowsAreAsync) {
      setTableRows(rows);
      setLoading(false);
      return;
    }

    const fetchRows = async () => {
      try {
        const result = await rows();
        setTableRows(result);
      } catch (error) {
        console.error("Error loading table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRows();
  }, [rows, rowsAreAsync]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return tableRows;
    }

    return tableRows.filter((row) =>
      row.some((cell) => getSearchableText(cell).toLowerCase().includes(normalizedQuery))
    );
  }, [searchTerm, tableRows]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeading
        title={title}
        description={description}
        action={
          addHref ? (
            <Link
              href={addHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          ) : null
        }
      />
      <input
        className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300 sm:max-w-sm"
        placeholder="Search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        </div>
      ) : (
        <AdminTable
          columns={columns}
          rows={filteredRows}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default AdminListPage;
