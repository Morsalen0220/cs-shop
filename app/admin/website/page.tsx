import getProducts from "@/actions/get-products";
import HomeSettingsForm from "@/components/admin/home-settings-form";
import PageHeading from "@/components/admin/page-heading";
import Link from "next/link";
import { ArrowRight, MonitorSmartphone, Sparkles } from "lucide-react";

const WebsitePage = async () => {
  const products = await getProducts({ includeArchived: true });

  return (
    <div className="space-y-8">
      <PageHeading
        title="Nikeshop"
        description="Edit the homepage, Sale page, New Arrivals page, and Blog page from a dedicated premium content workspace."
        action={
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
          >
            <MonitorSmartphone className="h-4 w-4" />
            Preview storefront
          </Link>
        }
      />

      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,90,31,0.14),_transparent_35%),linear-gradient(135deg,_#ffffff_0%,_#fff7f0_52%,_#eef2ff_100%)] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <Sparkles className="h-4 w-4" />
              Website Control
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#111111] sm:text-4xl">
              Control the announcement bar, hero offer, slider, newsletter, Sale page, New Arrivals page, Blog page, and every merchandising section from here.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              This studio keeps homepage storytelling separate from store operations, so editing customer-facing content feels fast, focused, and premium.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[ 
              "Announcement bar",
              "Navbar promo pill",
              "Hero offer and countdown",
              "Creative slider",
              "Sale and arrival pages",
              "Editorial blog page",
              "Why choose us cards",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-black/10 bg-white/80 p-4 text-sm font-semibold text-[#111111]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{item}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeSettingsForm products={products} />
    </div>
  );
};

export default WebsitePage;
