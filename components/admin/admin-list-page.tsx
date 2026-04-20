import AdminTable from "@/components/admin/admin-table";
import PageHeading from "@/components/admin/page-heading";
import Link from "next/link";
import { Plus } from "lucide-react";

interface AdminListPageProps {
  addHref?: string;
  columns: string[];
  description: string;
  rows: Array<Array<React.ReactNode>>;
  title: string;
}

const AdminListPage: React.FC<AdminListPageProps> = ({
  addHref,
  columns,
  description,
  rows,
  title,
}) => {
  return (
    <div className="space-y-8">
      <PageHeading
        title={title}
        description={description}
        action={
          addHref ? (
            <Link
              href={addHref}
              className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          ) : null
        }
      />
      <input
        className="h-10 w-full max-w-sm rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Search"
      />
      <AdminTable columns={columns} rows={rows} />
    </div>
  );
};

export default AdminListPage;
