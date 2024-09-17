"use client";

import { type ColumnDefinitionType } from "@/components/custom/data-table/schema";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowData,
  SortingState,
  Table as TTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { type ColumnType } from "@/components/custom/data-table/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableFilterControls } from "./data-table-filter-controls";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableFilterCommand } from "./data-table-filter-command";
import type { DataTableFilterField } from "./types";
import { DataTableToolbar } from "./data-table-toolbar";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import * as z from "zod";
import { isArrayOfDates, isArrayOfNumbers } from "./utils";
import { isSameDay } from "date-fns";

interface DataTableProps<TData extends RowData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  filterFields?: DataTableFilterField<TData>[];
  columnFilterSchema: z.ZodObject<Record<string, z.ZodType>>;
  columnDefinition: ColumnDefinitionType;
  handleColumnTypeChange: (column: string, type: ColumnType) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
  filterFields = [],
  columnFilterSchema,
  columnDefinition,
  handleColumnTypeChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("data-table-visibility", {});
  const [controlsOpen, setControlsOpen] = useLocalStorage(
    "data-table-controls",
    true
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting, columnVisibility, pagination },
    filterFns: { 
      filterNumber: (row, id, value) => {
        const rowValue = row.getValue(id) as number;
        if (typeof value === "number") return value === Number(rowValue);
        if (Array.isArray(value) && isArrayOfNumbers(value)) {
          const sorted = value.sort((a, b) => a - b);
          return sorted[0] <= rowValue && rowValue <= sorted[1];
        }
        return false;
      },
      filterDate: (row, id, value) => {
        const rowValue = row.getValue(id);
        if (value instanceof Date && rowValue instanceof Date) {
          return isSameDay(value, rowValue);
        }
        if (Array.isArray(value)) {
          if (isArrayOfDates(value) && rowValue instanceof Date) {
            const sorted = value.sort((a, b) => a.getTime() - b.getTime());
            return (
              sorted[0].getTime() <= rowValue.getTime() &&
              rowValue.getTime() <= sorted[1].getTime()
            );
          }
        }
        return false;
      },
      filterTag: (row, id, value) => {
        const array = row.getValue(id) as string[];
        if (typeof value === "string") return array.includes(value);
        // up to the user to define either `.some` or `.every`
        if (Array.isArray(value)) return value.some((i) => array.includes(i));
        return false;
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
      const map = getFacetedUniqueValues<TData>()(table, columnId)();
      const isColumnArray = data.some((row) =>
        Array.isArray(row[columnId as keyof TData])
      );
      if (isColumnArray) {
        const rowValues = table
          .getGlobalFacetedRowModel()
          .flatRows.map((row) => row.getValue(columnId) as string[]);
        for (const values of rowValues) {
          for (const value of values) {
            const prevValue = map.get(value) || 0;
            map.set(value, prevValue + 1);
          }
        }
      }
      return map;
    },
  });

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row h-full">
      <div
        className={cn(
          "w-full p-1 sm:sticky sm:top-0 sm:h-screen sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72",
          !controlsOpen && "hidden"
        )}
      >
        <div className="-m-1 h-full p-1 sm:overflow-x-hidden sm:overflow-y-scroll">
          <DataTableFilterControls
            table={table}
            filterFields={filterFields}
            columnDefinition={columnDefinition}
            handleColumnTypeChange={handleColumnTypeChange}
          />
        </div>
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
        <DataTableFilterCommand
          table={table}
          schema={columnFilterSchema}
          filterFields={filterFields}
        />
        <DataTableToolbar
          table={table}
          controlsOpen={controlsOpen}
          setControlsOpen={setControlsOpen}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
