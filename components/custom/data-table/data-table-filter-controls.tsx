"use client";

import type { Table } from "@tanstack/react-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { type ColumnDefinitionType } from "@/components/custom/data-table/schema";

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
  url_preview: <Link2 className="h-4 w-4" />,
  tags: <Tag className="h-4 w-4" />,
  images: <FileImage className="h-4 w-4" />,
};


export function DataTableFilterControls<TData>({
  table,
  filterFields,
  columnDefinition,
  handleColumnTypeChange,
}: DataTableFilterControlsProps<TData>) {
  const filters = table.getState().columnFilters;
  const updateSearchParams = useUpdateSearchParams();
  const router = useRouter();

  const updatePageSearchParams = (values: Record<string, string | null>) => {
    const newSearchParams = updateSearchParams(values);
    router.replace(`?${newSearchParams}`, { scroll: false });
  };

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
        defaultValue={filterFields
          ?.filter(({ defaultOpen }) => defaultOpen)
          ?.map(({ value }) => value as string)}
      >
        {filterFields?.map((field) => {
          return (
            <AccordionItem
              key={field.value as string}
              value={field.value as string}
              className="border-none"
            >
              <AccordionTrigger className="p-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  {iconMap[columnDefinition[field.value as string]]}
                  <p className="text-sm font-medium text-foreground">
                    {field.label}
                  </p>
                  <DataTableFilterResetButton table={table} {...field} />
                </div>
              </AccordionTrigger>

              <AccordionContent className="-m-4 p-4">
                <div>
                  <ToggleGroup type="single" className="my-2 mx-2 pb-2 grid grid-cols-4 gap-1" 
                    onValueChange={(value) => {
                      handleColumnTypeChange(field.value as string, value.toString() as ColumnType);
                    }}>
                    <ToggleGroupItem className="border border-border" value="string" aria-label="Toggle String">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Text className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            String
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="number" aria-label="Toggle Number">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Hash className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Number
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="boolean" aria-label="Toggle Boolean">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CheckSquare className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Boolean
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="date" aria-label="Toggle Date">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Calendar className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Date
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="url" aria-label="Toggle URL">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            URL
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="url_preview" aria-label="Toggle URL Preview">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link2 className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            URL Preview
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="tags" aria-label="Toggle Tags">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Tag className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Tags
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>

                    <ToggleGroupItem className="border border-border" value="images" aria-label="Toggle Images">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FileImage className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Images
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </ToggleGroupItem>


                  </ToggleGroup>
                </div>
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
                    case "timerange": {
                      return (
                        <DataTableFilterTimerange table={table} {...field} />
                      );
                    }
                  }
                })()}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
