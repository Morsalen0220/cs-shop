import PageHeading from "@/components/admin/page-heading";

const settingsCards = [
  {
    title: "Store Identity",
    description: "Brand name, operator details, and storefront positioning live here next.",
  },
  {
    title: "Commerce Policies",
    description: "Shipping, return, and payment policy controls can be expanded from this section.",
  },
  {
    title: "Operations",
    description: "Use this area for future tax, order-routing, and team workflow settings.",
  },
];

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Store Settings"
        description="Store operations now have a cleaner dedicated space, while homepage content lives in Nikeshop."
      />

      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
            Coming together
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#111111]">
            Store operations stay focused here.
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            Homepage banners, slider content, announcement bars, and merchandising sections are now separated into the dedicated Nikeshop area so this page can stay focused on store-level controls.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {settingsCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[28px] border border-black/10 bg-[#faf9f6] p-5"
            >
              <h3 className="text-lg font-semibold text-[#111111]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
