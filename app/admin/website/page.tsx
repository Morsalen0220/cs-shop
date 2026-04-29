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
        description="Manage homepage, sale page, arrivals page, blog, and footer content."
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

      <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,106,26,0.14),_transparent_36%),linear-gradient(135deg,_#ffffff_0%,_#fff8f1_54%,_#f7f7f4_100%)] p-6 shadow-[0_22px_64px_rgba(17,17,17,0.06)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_14px_30px_rgba(17,17,17,0.12)]">
              <Sparkles className="h-4 w-4" />
              Website Control
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-[#111111] sm:text-4xl">
              Website settings
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Update homepage, sale page, arrivals page, blog content, and footer settings.
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
                className="rounded-[26px] border border-black/10 bg-white/85 p-4 text-sm font-semibold text-[#111111] shadow-[0_14px_34px_rgba(17,17,17,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_46px_rgba(17,17,17,0.07)]"
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
