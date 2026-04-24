import Container from "@/components/ui/container";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

const values = [
  {
    title: "Performance first",
    description:
      "We curate Nike pairs that balance comfort, motion, and everyday wearability.",
    icon: Sparkles,
  },
  {
    title: "Trusted delivery",
    description:
      "Fast dispatch, clear updates, and careful packaging from checkout to doorstep.",
    icon: Truck,
  },
  {
    title: "Secure shopping",
    description:
      "A clean storefront experience with reliable support and protected checkout flow.",
    icon: ShieldCheck,
  },
];

const AboutPage = () => {
  return (
    <div className="about-page bg-[linear-gradient(180deg,_#f8f5f1_0%,_#ffffff_34%)]">
      <Container>
        <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <section className="about-hero overflow-hidden rounded-[36px] border border-black/10 bg-[linear-gradient(135deg,_#111111_0%,_#1b1b1b_48%,_#f8eee6_48%,_#fff8f3_100%)] p-6 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">
                  About us
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-[0.94] text-white sm:text-5xl lg:text-6xl">
                  We built this Nike shop to feel fast, focused, and easy to trust.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
                  From new-season drops to everyday icons, our goal is to keep the
                  storefront sharp, the selection curated, and the experience smooth.
                </p>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/88 p-6 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                  What we do
                </p>
                <p className="mt-3 text-3xl font-semibold leading-tight text-[#111111]">
                  Curated Nike shopping with a cleaner digital experience.
                </p>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  We focus on premium presentation, easy discovery, and collections
                  that make browsing feel intentional instead of crowded.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="about-surface rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.05)]"
                >
                  <div className="inline-flex rounded-2xl bg-[#fff2e8] p-3 text-[#ff5a1f]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-[#111111]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="about-surface rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.05)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                Our approach
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#111111]">
                A modern storefront with a more curated feel.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                <p>
                  We are not trying to show everything at once. We care about clear
                  navigation, cleaner product discovery, and category pages that help
                  people make a decision quickly.
                </p>
                <p>
                  That means stronger merchandising, more polished landing sections,
                  and product collections that feel edited instead of overloaded.
                </p>
                <p>
                  The result is a shopping experience designed for movement, speed,
                  and confidence from homepage to checkout.
                </p>
              </div>
            </div>

            <div className="about-surface rounded-[32px] border border-black/10 bg-[linear-gradient(180deg,_#fff8f2_0%,_#fff1e7_100%)] p-6 shadow-[0_18px_60px_rgba(17,17,17,0.05)] sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                Next step
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#111111]">
                Need help or want to reach us directly?
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base">
                Visit the contact page for store questions, support details, and a
                quick message form.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
