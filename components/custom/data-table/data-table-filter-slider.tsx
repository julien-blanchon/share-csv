"use client";

import useUpdateSearchParams from "@/hooks/use-update-search-params";
import type { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";
import type { DataTableSliderFilterField } from "./types";
import { InputWithAddons } from "@/components/ui/input-with-addons";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { isArrayOfNumbers } from "./utils";
import { SLIDER_DELIMITER } from "./schema";

type DataTableFilterSliderProps<TData> = DataTableSliderFilterField<TData> & {
  table: Table<TData>;
};

export function DataTableFilterSlider<TData>({
  table,
  value: _value,
  min,
  max,
}: DataTableFilterSliderProps<TData>) {
  const value = _value as string;
  const updateSearchParams = useUpdateSearchParams();
  const router = useRouter();
  const column = table.getColumn(value);
  const filterValue = column?.getFilterValue();

  const filters = useMemo(() => {
    return typeof filterValue === "number"
      ? [filterValue, filterValue]
      : Array.isArray(filterValue) && isArrayOfNumbers(filterValue)
      ? filterValue
      : [min, max];
  }, [filterValue, min, max]);

  // Local state to update the slider value instantly
  const [sliderValue, setSliderValue] = useState<number[]>(filters);

  const updatePageSearchParams = useCallback(
    (values: Record<string, string | null>) => {
      const newSearchParams = updateSearchParams(values);
      router.replace(`?${newSearchParams}`, { scroll: false });
    },
    [router, updateSearchParams]
  );

  // Debounce the search params update but allow immediate value updates in the UI
  const debouncedHandleChange = useMemo(
    () =>
      debounce((newValue: number[]) => {
        column?.setFilterValue(newValue);
        updatePageSearchParams({
          [value]: newValue.join(SLIDER_DELIMITER),
        });
      }, 300), // 300ms debounce delay
    [column, updatePageSearchParams, value]
  );

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue); // Update slider value instantly
    debouncedHandleChange(newValue); // Update the search params after debounce
  };

  const handleInputChange = useCallback(
    (inputValue: number, isMin: boolean) => {
      const otherValue = isMin ? sliderValue[1] ?? max : sliderValue[0] ?? min;
      const newValue = isMin
        ? [inputValue, Math.max(inputValue, otherValue)]
        : [Math.min(inputValue, otherValue), inputValue];
      setSliderValue(newValue); // Update slider value instantly
      debouncedHandleChange(newValue); // Debounce search params update
    },
    [sliderValue, min, max, debouncedHandleChange]
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4">
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`min-${value}`}
            className="px-2 text-muted-foreground"
          >
            Min.
          </Label>
          <InputWithAddons
            placeholder="from"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`min-${value}`}
            id={`min-${value}`}
            value={`${sliderValue[0] ?? min}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || min;
              handleInputChange(val, true);
            }}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            htmlFor={`max-${value}`}
            className="px-2 text-muted-foreground"
          >
            Max.
          </Label>
          <InputWithAddons
            placeholder="to"
            containerClassName="mb-2 h-9 rounded-lg"
            type="number"
            name={`max-${value}`}
            id={`max-${value}`}
            value={`${sliderValue[1] ?? max}`}
            min={min}
            max={max}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value) || max;
              handleInputChange(val, false);
            }}
          />
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={sliderValue}
        onValueChange={handleSliderChange}
      />
    </div>
  );
}
