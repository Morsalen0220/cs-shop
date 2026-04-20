import Container from "@/components/ui/container";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Email support",
    description: "hello@nikeshop.demo",
    icon: Mail,
  },
  {
    title: "Call us",
    description: "+880 1700-000000",
    icon: Phone,
  },
  {
    title: "Store desk",
    description: "Dhaka, Bangladesh",
    icon: MapPin,
  },
  {
    title: "Hours",
    description: "Sat - Thu, 10:00 AM - 8:00 PM",
    icon: Clock3,
  },
];

const ContactPage = () => {
  return (
    <div className="bg-[linear-gradient(180deg,_#f8f5f1_0%,_#ffffff_34%)]">
      <Container>
        <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[36px] border border-black/10 bg-[linear-gradient(135deg,_#fff7f1_0%,_#ffffff_44%,_#eef3ff_100%)] p-6 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gray-400">
                  Contact
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-[0.95] text-[#111111] sm:text-5xl lg:text-6xl">
                  Let&apos;s talk about your order, sizing, or the next drop.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                  Reach out for product questions, delivery support, or general store
                  help. We kept this page simple so customers can find answers fast.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {contactCards.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_14px_35px_rgba(17,17,17,0.05)]"
                      >
                        <div className="inline-flex rounded-2xl bg-[#fff2e8] p-3 text-[#ff5a1f]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[#111111]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.05)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Send a message
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#111111]">
                  We&apos;ll get back to you as soon as possible.
                </h2>

                <form className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      className="h-12 rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                      placeholder="Your name"
                      type="text"
                    />
                    <input
                      className="h-12 rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                      placeholder="Email address"
                      type="email"
                    />
                  </div>
                  <input
                    className="h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                    placeholder="Subject"
                    type="text"
                  />
                  <textarea
                    className="min-h-[160px] w-full rounded-[24px] border border-black/10 bg-[#faf7f3] px-4 py-4 text-sm text-[#111111] outline-none"
                    placeholder="Write your message"
                  />
                  <button
                    className="inline-flex h-12 items-center rounded-full bg-[#111111] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                    type="submit"
                  >
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
