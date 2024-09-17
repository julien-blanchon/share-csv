"use client";

import type { Table } from "@tanstack/react-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type React from "react";
import type { DataTableFilterField } from "./types";
import { DataTableFilterResetButton } from "./data-table-filter-reset-button";
import { DataTableFilterCheckobox } from "./data-table-filter-checkbox";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTableFilterSlider } from "./data-table-filter-slider";
import { DataTableFilterInput } from "./data-table-filter-input";
import { DataTableFilterTimerange } from "./data-table-filter-timerange";
import { X, Text, Hash, CheckSquare, Calendar, Link, Link2, Tag, FileImage } from "lucide-react";
import { type ColumnType } from "@/components/custom/data-table/schema";
import { Separator } from "@/components/ui/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { type ColumnDefinitionType } from "@/components/custom/data-table/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";

// TODO: only pass the columns to generate the filters!
// https://tanstack.com/table/v8/docs/framework/react/examples/filters
interface DataTableFilterControlsProps<TData> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  columnDefinition: ColumnDefinitionType;
  handleColumnTypeChange: (column: string, type: ColumnType) => void;
}

const iconMap: Record<ColumnType, React.ReactNode> = {
  string: <Text className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  boolean: <CheckSquare className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  url: <Link className="h-4 w-4" />,
  tags: <Tag className="h-4 w-4" />,
  images: <FileImage className="h-4 w-4" />,
};


export function DataTableFilterControls<TData>({
  table,
  filterFields,
  columnDefinition,
  handleColumnTypeChange,
}: DataTableFilterControlsProps<TData>) {
  console.log(columnDefinition)
  const filters = table.getState().columnFilters;
  const updateSearchParams = useUpdateSearchParams();
  const router = useRouter();

  const updatePageSearchParams = (values: Record<string, string | null>) => {
    const newSearchParams = updateSearchParams(values);
    router.replace(`?${newSearchParams}`, { scroll: false });
  };

  const orderedFilterFields = filterFields?.sort((a, b) => {
    const positionA = columnDefinition[a.value as string]?.position || 0;
    const positionB = columnDefinition[b.value as string]?.position || 0;
    return positionA - positionB;
  }) || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-[46px] items-center justify-between gap-3">
        <p className="font-medium text-foreground">Filters</p>
        <div>
          {filters.length ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                table.resetColumnFilters();
                const resetValues = filters.reduce<Record<string, null>>(
                  (prev, curr) => {
                    prev[curr.id] = null;
                    return prev;
                  },
                  {}
                );
                updatePageSearchParams(resetValues);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>
      <Accordion
        type="multiple"
        // REMINDER: open all filters by default
        defaultValue={orderedFilterFields
          ?.filter(({ defaultOpen }) => defaultOpen)
          ?.map(({ value }) => value as string)}
      >
        {orderedFilterFields.map((field) => {
          const currentType = columnDefinition[field.value as string]["type"];
          return (
            <AccordionItem
              key={field.value as string}
              value={field.value as string}
              className="border-none"
            >
              <AccordionTrigger className="p-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  {iconMap[columnDefinition[field.value as string]["type"]]}
                  <p className="text-sm font-medium text-foreground">
                    {field.label}
                  </p>
                  <DataTableFilterResetButton table={table} {...field} />
                </div>
              </AccordionTrigger>

              <AccordionContent className="-m-4 p-4">
                <div className="flex items-center space-x-2">
                  <div className="items-center border-input ring-offset-background focus-visible:ring-ring group flex h-9 w-full rounded-md border bg-transparent text-sm focus-within:outline-none focus-visible:ring-2 focus-within:ring-offset-2 overflow-hidden">
                    <div className="flex items-center border-input bg-muted border-r px-3 h-full">
                      {iconMap[currentType]}
                    </div>
                    <Select
                      value={currentType}
                      onValueChange={(value) => handleColumnTypeChange(field.value as string, value as ColumnType)}
                    >
                      <SelectTrigger id={`type-select-${field.value as string}`} className="w-full border-0 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select a type">
                          <div className="flex items-center text-muted-foreground">
                            <span>{currentType}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(iconMap).map(([type, icon]) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center">
                              <span className="mr-2 flex-shrink-0">{icon}</span>
                              <span>{type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="px-4 my-3">
                  <Separator className="w-2/3 mx-auto" />
                </div>
                <div className="mt-2">
                  {(() => {
                    switch (field.type) {
                      case "checkbox": {
                        return (
                          <DataTableFilterCheckobox table={table} {...field} />
                        );
                      }
                      case "slider": {
                        return <DataTableFilterSlider table={table} {...field} />;
                      }
                      case "input": {
                        return <DataTableFilterInput table={table} {...field} />;
                      }
                      case "none": {
                        return null;
                      }
                      case "timerange": {
                        return (
                          <DataTableFilterTimerange table={table} {...field} />
                        );
                      }
                    }
                  })()}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
