"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color, Size } from "@/types";

type FilterItem = {
  id: string;
  name: string;
};

interface FilterProps {
  data: (Size | Color | FilterItem)[];
  name: string;
  onValueChange?: (value: string | null) => void;
  selectedValue?: string | null;
  valueKey: string;
}

const Filter: React.FC<FilterProps> = ({
  data,
  name,
  onValueChange,
  selectedValue: controlledSelectedValue,
  valueKey,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = controlledSelectedValue ?? searchParams.get(valueKey);

  const onClick = (id: string) => {
    const nextValue = selectedValue === id ? null : id;

    if (onValueChange) {
      onValueChange(nextValue);
      return;
    }

    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: nextValue,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-base font-semibold text-[#111111]">{name}</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
        Refine your picks
      </p>
      <hr className="my-4 border-black/8" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <Button
              className={cn(
                "rounded-full border border-black/10 bg-[#faf7f3] px-4 py-2 text-sm text-gray-700 shadow-none",
                selectedValue === filter.id &&
                  "border-[#111111] bg-[#111111] text-white"
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
