import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-admin-panel
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(255,106,26,0.08),_transparent_32%),linear-gradient(180deg,_#f8f6f2_0%,_#f1eee8_100%)] text-gray-950"
    >
      <AdminNav />
      <main className="min-w-0 xl:ml-[292px]">
        <div className="sticky top-0 z-30 border-b border-black/5 bg-white/80 px-4 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.04)] backdrop-blur sm:px-6 sm:py-5 xl:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff6a1a]">
                Nikeshop Admin
              </p>
              <p className="mt-1 text-lg font-semibold text-[#111111]">
                Store management
              </p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-black/10 bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(17,17,17,0.12)] sm:px-4 sm:py-2 sm:text-sm">
              Local content editing active
            </div>
          </div>
        </div>
        <div className="px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">{children}</div>
      </main>
    </div>
  );
}
