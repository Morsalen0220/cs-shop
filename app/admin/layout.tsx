import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-950">
      <AdminNav />
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
