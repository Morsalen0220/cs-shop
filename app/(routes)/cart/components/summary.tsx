"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { readHomeSettings } from "@/lib/home-settings";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const appliedPromoCode = useCart((state) => state.appliedPromoCode);
  const setAppliedPromoCode = useCart((state) => state.setAppliedPromoCode);
  const clearAppliedPromoCode = useCart((state) => state.clearAppliedPromoCode);
  const [promoInput, setPromoInput] = useState("");
  const [promoCodes, setPromoCodes] = useState(() => readHomeSettings().promoCodes);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  useEffect(() => {
    const syncPromoCodes = () => setPromoCodes(readHomeSettings().promoCodes);

    syncPromoCodes();
    window.addEventListener("storage", syncPromoCodes);
    window.addEventListener("home-settings-updated", syncPromoCodes);

    return () => {
      window.removeEventListener("storage", syncPromoCodes);
      window.removeEventListener("home-settings-updated", syncPromoCodes);
    };
  }, []);

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const activePromo = useMemo(
    () =>
      promoCodes.find(
        (promo) =>
          promo.enabled &&
          promo.code.trim().toUpperCase() === appliedPromoCode.trim().toUpperCase()
      ) ?? null,
    [appliedPromoCode, promoCodes]
  );

  const discountAmount = activePromo
    ? activePromo.type === "percentage"
      ? (subtotal * activePromo.value) / 100
      : Math.min(activePromo.value, subtotal)
    : 0;
  const totalPrice = Math.max(subtotal - discountAmount, 0);

  useEffect(() => {
    if (!appliedPromoCode) {
      return;
    }

    if (!activePromo) {
      clearAppliedPromoCode();
      toast.error("Saved promo code is no longer available.");
      return;
    }

    setPromoInput(activePromo.code);
  }, [activePromo, appliedPromoCode, clearAppliedPromoCode]);

  const onApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      toast.error("Enter a promo code first.");
      return;
    }

    const match = promoCodes.find(
      (promo) => promo.enabled && promo.code.trim().toUpperCase() === code
    );

    if (!match) {
      toast.error("Promo code not found.");
      return;
    }

    setAppliedPromoCode(match.code);
    setPromoInput(match.code);
    toast.success("Promo code applied.");
  };

  const onRemovePromo = () => {
    clearAppliedPromoCode();
    setPromoInput("");
    toast.success("Promo code removed.");
  };

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
        promoCode: activePromo?.code ?? null,
      }
    );

    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-[#111111]">Promo code</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          Add a promo code from the store admin panel and customers can apply it here.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <input
            className="h-11 w-full rounded-full border border-black/10 bg-[#faf7f3] px-4 text-sm text-[#111111] outline-none"
            onChange={(event) => setPromoInput(event.target.value)}
            placeholder="Enter promo code"
            value={promoInput}
          />
          <div className="flex gap-2">
            <Button className="flex-1 bg-[#111111]" onClick={onApplyPromo}>
              Apply code
            </Button>
            {activePromo ? (
              <Button
                className="border border-black/10 bg-white text-[#111111]"
                onClick={onRemovePromo}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        {activePromo ? (
          <div className="mt-4 rounded-2xl bg-[#fff3ed] px-4 py-3 text-sm text-[#111111]">
            <p className="font-semibold">{activePromo.code}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#ff5a1f]">
              {activePromo.label}
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Subtotal</div>
          <Currency value={subtotal} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Discount</div>
          <span className="text-sm font-medium text-[#ff5a1f]">
            -<Currency value={discountAmount} />
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
