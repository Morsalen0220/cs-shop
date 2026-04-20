"use client";

import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const ACCOUNT_STORAGE_KEY = "nike-shop-customer-account";

type AuthMode = "create" | "login";

interface CustomerAccount {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  addressLine: string;
  city: string;
  area: string;
  postalCode: string;
}

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  addressLine: "",
  city: "",
  area: "",
  postalCode: "",
};

const sidebarItems = [
  { label: "Overview", icon: Sparkles },
  { label: "Orders", icon: Package },
  { label: "Addresses", icon: MapPin },
  { label: "Favorites", icon: Heart },
];

const AccountForm = () => {
  const cartItems = useCart((state) => state.items);
  const [mode, setMode] = useState<AuthMode>("create");
  const [storedAccount, setStoredAccount] = useState<CustomerAccount | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);

      if (!raw) {
        return;
      }

      const account = JSON.parse(raw) as CustomerAccount;
      setStoredAccount(account);
      setForm((current) => ({
        ...current,
        email: account.email,
      }));
    } catch {
      setStoredAccount(null);
    }
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price), 0),
    [cartItems]
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const persistAccount = (account: CustomerAccount) => {
    window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
    setStoredAccount(account);
  };

  const onCreateAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please complete the required fields.");
      return;
    }

    const nextAccount: CustomerAccount = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      area: form.area.trim(),
      postalCode: form.postalCode.trim(),
    };

    persistAccount(nextAccount);
    setIsLoggedIn(true);
    toast.success("Account created successfully.");
  };

  const onLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!storedAccount) {
      toast.error("No account found. Create an account first.");
      return;
    }

    if (
      form.email.trim().toLowerCase() !== storedAccount.email.toLowerCase() ||
      form.password !== storedAccount.password
    ) {
      toast.error("Email or password did not match.");
      return;
    }

    setIsLoggedIn(true);
    toast.success("Logged in successfully.");
  };

  const onSaveAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!storedAccount) {
      return;
    }

    const nextAccount = {
      ...storedAccount,
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      area: form.area.trim(),
      postalCode: form.postalCode.trim(),
    };

    persistAccount(nextAccount);
    toast.success("Address saved.");
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setForm({
      ...emptyForm,
      email: storedAccount?.email ?? "",
    });
    toast.success("Logged out.");
  };

  useEffect(() => {
    if (!storedAccount || !isLoggedIn) {
      return;
    }

    setForm({
      fullName: storedAccount.fullName,
      email: storedAccount.email,
      phone: storedAccount.phone,
      password: storedAccount.password,
      addressLine: storedAccount.addressLine,
      city: storedAccount.city,
      area: storedAccount.area,
      postalCode: storedAccount.postalCode,
    });
  }, [storedAccount, isLoggedIn]);

  const savedAddress = storedAccount
    ? [
        storedAccount.addressLine,
        storedAccount.city,
        storedAccount.area,
        storedAccount.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const summaryCards = [
    {
      title: "My orders",
      value: "0",
      note: "No recent orders yet",
      icon: Package,
    },
    {
      title: "Saved address",
      value: savedAddress ? "1" : "0",
      note: savedAddress || "Add your delivery location",
      icon: MapPin,
    },
    {
      title: "Cart items",
      value: String(cartItems.length),
      note: `Total ${cartTotal.toLocaleString()}`,
      icon: ShoppingBag,
    },
    {
      title: "Favorite items",
      value: "0",
      note: "Wishlist ready for future connection",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-[860px] overflow-hidden rounded-[34px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)] xl:flex">
      <aside className="w-full shrink-0 border-b border-white/10 bg-[linear-gradient(180deg,_#111111_0%,_#171717_48%,_#0b0b0b_100%)] p-5 text-white xl:min-h-[860px] xl:w-[292px] xl:border-b-0 xl:border-r">
        <div className="flex h-full flex-col">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#111111]">
                <User2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  Nike Shop
                </p>
                <p className="mt-1 text-lg font-semibold text-white">My Account</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/60">
              A cleaner customer dashboard for profile details, addresses, cart
              access, and future order history.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
              Account Space
            </p>
            <div className="space-y-1.5">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition",
                      index === 0
                        ? "bg-white text-[#111111] shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
                        : "text-white/65"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="opacity-50">›</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/40">
              Customer Status
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {storedAccount
                ? `${storedAccount.fullName} has a saved account profile on this device.`
                : "No customer profile saved yet. Create one from the dashboard panel."}
            </p>
            {storedAccount ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{storedAccount.fullName}</p>
                <p className="mt-1 text-xs text-white/55">{storedAccount.email}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/40">
              Quick Action
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Open the storefront and continue shopping anytime from your account center.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111111]"
            >
              <ShoppingBag className="h-4 w-4" />
              Open Shop
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-black/5 bg-white/70 px-6 py-5 backdrop-blur xl:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Nike Shop Account
              </p>
              <p className="mt-1 text-lg font-semibold text-[#111111]">
                Customer dashboard and profile center
              </p>
            </div>
            {isLoggedIn ? (
              <button
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600"
                onClick={onLogout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            ) : (
              <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600">
                Sign in or create your customer profile
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-8 xl:px-10">
          {!isLoggedIn ? (
            <div className="space-y-8">
              <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,90,31,0.16),_transparent_34%),linear-gradient(135deg,_#111111_0%,_#1f2937_55%,_#0f172a_100%)] p-6 text-white shadow-[0_28px_80px_rgba(17,17,17,0.16)] sm:p-8">
                <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                      <Sparkles className="h-4 w-4" />
                      Account Studio
                    </div>
                    <div>
                      <h2 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                        Sign in, save your profile, and manage everything from one clear dashboard.
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        This page now works more like a premium dashboard so customers can understand profile, orders, addresses, and saved activity much faster.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Profile and customer info",
                      "Saved addresses",
                      "Order history area",
                      "Cart and favorites access",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[26px] border border-white/10 bg-white/8 p-4 text-sm font-semibold text-white"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Access
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      Create account or log in
                    </h2>
                  </div>
                  <div className="inline-flex rounded-full border border-black/10 bg-[#faf7f3] p-1">
                    {[
                      { key: "create", label: "Create account" },
                      { key: "login", label: "Log in" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition",
                          mode === item.key
                            ? "bg-[#111111] text-white"
                            : "text-gray-500"
                        )}
                        onClick={() => setMode(item.key as AuthMode)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]"
                  onSubmit={mode === "create" ? onCreateAccount : onLogin}
                >
                  <div className="space-y-4">
                    {mode === "create" ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-[#111111]" htmlFor="fullName">
                            Full name
                          </label>
                          <input
                            id="fullName"
                            className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                            onChange={(event) => updateField("fullName", event.target.value)}
                            placeholder="Enter your full name"
                            value={form.fullName}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-[#111111]" htmlFor="email">
                              Email address
                            </label>
                            <input
                              id="email"
                              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                              onChange={(event) => updateField("email", event.target.value)}
                              placeholder="name@email.com"
                              type="email"
                              value={form.email}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-[#111111]" htmlFor="phone">
                              Phone number
                            </label>
                            <input
                              id="phone"
                              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                              onChange={(event) => updateField("phone", event.target.value)}
                              placeholder="+880 1XXXXXXXXX"
                              value={form.phone}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-[#111111]" htmlFor="loginEmail">
                          Email address
                        </label>
                        <input
                          id="loginEmail"
                          className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                          onChange={(event) => updateField("email", event.target.value)}
                          placeholder="name@email.com"
                          type="email"
                          value={form.email}
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-[#111111]" htmlFor="password">
                        Password
                      </label>
                      <input
                        id="password"
                        className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
                        onChange={(event) => updateField("password", event.target.value)}
                        placeholder={mode === "create" ? "Create a password" : "Enter your password"}
                        type="password"
                        value={form.password}
                      />
                    </div>

                    <Button className="w-full bg-[#111111] py-3">
                      {mode === "create" ? "Create account" : "Log in"}
                    </Button>
                  </div>

                  <div className="rounded-[28px] border border-black/10 bg-[#faf7f3] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Account benefits
                    </p>
                    <div className="mt-5 space-y-4">
                      {[
                        "Save your delivery details for faster checkout.",
                        "Keep a dedicated space ready for future orders.",
                        "Use one clean dashboard for customer actions.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-5 w-5 text-[#ff5a1f]" />
                          <p className="text-sm leading-6 text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </section>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,90,31,0.16),_transparent_34%),linear-gradient(135deg,_#111111_0%,_#1f2937_55%,_#0f172a_100%)] p-6 text-white shadow-[0_28px_80px_rgba(17,17,17,0.16)] sm:p-8">
                <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                      <Sparkles className="h-4 w-4" />
                      Customer Dashboard
                    </div>
                    <div>
                      <h2 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                        Welcome back, {storedAccount?.fullName || "customer"}.
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        Review account details, saved delivery info, cart activity, and future orders from one premium customer dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {summaryCards.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white/65">{item.title}</p>
                            <Icon className="h-4 w-4 text-white/55" />
                          </div>
                          <p className="mt-5 text-3xl font-semibold">{item.value}</p>
                          <p className="mt-2 text-sm text-white/55">{item.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Profile
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      Account details
                    </h2>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-[#f8f6f1] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        Full name
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[#111111]">
                        {storedAccount?.fullName}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[#f8f6f1] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        Email
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[#111111] break-all">
                        {storedAccount?.email}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-[#f8f6f1] p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                        Phone
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[#111111]">
                        {storedAccount?.phone || "No phone number added yet"}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Order history
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      Recent orders
                    </h2>
                  </div>
                  <div className="mt-6 rounded-[24px] border border-dashed border-black/10 bg-[#f8f6f1] p-5">
                    <p className="text-sm font-semibold text-[#111111]">
                      No order history yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Once this store is connected to real checkout and customer orders, this dashboard card can show recent purchases and tracking status.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-4 inline-flex rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Start shopping
                    </Link>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <form
                  className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]"
                  onSubmit={onSaveAddress}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Saved address
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      Delivery information
                    </h2>
                  </div>
                  <div className="mt-6 space-y-4">
                    <input
                      className="h-12 w-full rounded-2xl border border-black/10 bg-[#f8f6f1] px-4 text-sm text-[#111111] outline-none"
                      onChange={(event) => updateField("addressLine", event.target.value)}
                      placeholder="House, road, street"
                      value={form.addressLine}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <input
                        className="h-12 w-full rounded-2xl border border-black/10 bg-[#f8f6f1] px-4 text-sm text-[#111111] outline-none"
                        onChange={(event) => updateField("city", event.target.value)}
                        placeholder="City"
                        value={form.city}
                      />
                      <input
                        className="h-12 w-full rounded-2xl border border-black/10 bg-[#f8f6f1] px-4 text-sm text-[#111111] outline-none"
                        onChange={(event) => updateField("area", event.target.value)}
                        placeholder="Area"
                        value={form.area}
                      />
                      <input
                        className="h-12 w-full rounded-2xl border border-black/10 bg-[#f8f6f1] px-4 text-sm text-[#111111] outline-none"
                        onChange={(event) => updateField("postalCode", event.target.value)}
                        placeholder="Postal code"
                        value={form.postalCode}
                      />
                    </div>
                    <Button className="bg-[#111111]">Save address</Button>
                  </div>
                </form>

                <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                      Quick customer shortcuts
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                      Cart and favorites
                    </h2>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Link
                      href="/cart"
                      className="block rounded-[24px] border border-black/10 bg-[#f8f6f1] px-4 py-4 transition hover:border-black/20"
                    >
                      <p className="text-sm font-semibold text-[#111111]">My cart</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {cartItems.length} item in cart right now
                      </p>
                    </Link>
                    <div className="rounded-[24px] border border-black/10 bg-[#f8f6f1] px-4 py-4">
                      <p className="text-sm font-semibold text-[#111111]">
                        Favorite items
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Wishlist support can plug into this section next.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
