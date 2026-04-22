import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f3] text-gray-950">
      <AdminNav />
      <main className="min-w-0 xl:ml-[292px]">
        <div className="border-b border-black/5 bg-white/70 px-6 py-5 backdrop-blur xl:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Nikeshop Admin
              </p>
              <p className="mt-1 text-lg font-semibold text-[#111111]">
                Premium storefront management
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600">
              Local content editing active
            </div>
          </div>
        </div>
        <div className="px-6 py-8 xl:px-10">{children}</div>
      </main>
    </div>
  );
}
