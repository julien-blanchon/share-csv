"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Minus } from "lucide-react";
import { ColumnDefinitionType } from "./schema";
import { format } from "date-fns";
import { generateColorFromName } from "./constants";
import { DataTableColumnHeader } from "./data-table-column-header";
import { LinkPreview } from "@/components/ui/link-preview";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to create a default header
const createDefaultHeader = (key: string, column: any) => (
  <DataTableColumnHeader column={column} title={capitalizeFirstLetter(key)} />
);


// Function to create columns based on the column definition
export const makeColumns = (columnDefinition: ColumnDefinitionType): ColumnDef<any>[] => {
  return Object.entries(columnDefinition).map(([key, { type }]): ColumnDef<any> => { // Updated to access type from new schema
    const baseColumn: Partial<ColumnDef<any>> = {
      id: key,
      accessorKey: key,
      header: ({ column }) => createDefaultHeader(key, column),
    };

    switch (type) {
      case "string":
        return {
          ...baseColumn,
          cell: ({ row }) => <span>{row.getValue(key)}</span>,
          filterFn: "auto",
          header: ({ column }) => <span>{capitalizeFirstLetter(key)}</span>,
        } as ColumnDef<any>;

      case "number":
        return {
          ...baseColumn,
          cell: ({ row }) => {
            const value = row.getValue(key) as number;
            return value ? <span>{value}</span> : <Minus className="h-4 w-4 text-muted-foreground/50" />;
          },
          filterFn: "auto",
        } as ColumnDef<any>;

      case "boolean":
        return {
          ...baseColumn,
          filterFn: (row, id, value) => {
            const _rowValue = row.getValue(id);
            const rowValue = typeof _rowValue === "string" ? _rowValue.toLowerCase() === "true" : _rowValue;
            return Array.isArray(value) ? value.includes(rowValue) : value === rowValue;
            // return Array.isArray(value) ? value.includes(rowValue) : value === rowValue;
          },
          cell: ({ row }) => {
            const _value = row.getValue(key)
            let value: boolean;
            // if _value is a string, convert it to a boolean
            if (typeof _value === "string") {
              value = _value.toLowerCase() === "true";
            } else {
              value = _value as boolean;
            }
            return value ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-muted-foreground/50" />;
          },
        } as ColumnDef<any>;

      case "date":
        return {
          ...baseColumn,
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            try {
              const date = format(new Date(value), "LLL dd, y HH:mm");
              return <span className="text-muted-foreground">{date}</span>;
            } catch (error) {
              console.error("Error parsing date", error);
              return <span className="text-muted-foreground">{value}</span>;
            }
          },
          filterFn: "auto",
        } as ColumnDef<any>;

      case "url":
        return {
          ...baseColumn,
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return (
              <LinkPreview url={value} className="underline underline-offset-2 hover:no-underline transition-all">
                {value}
              </LinkPreview>
            );
          },
          enableColumnFilter: false,
          header: ({ column }) => <span>{capitalizeFirstLetter(key)}</span>,
        } as ColumnDef<any>;

      case "tags":
        return {
          ...baseColumn,
          cell: ({ row }) => {
            const value = row.getValue(key) as string | string[];
            const tags = Array.isArray(value) ? value : [value];
            return (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-inherit text-xs"
                    style={{
                      color: generateColorFromName(tag, 1),
                      backgroundColor: generateColorFromName(tag, 0.1),
                      borderColor: generateColorFromName(tag, 0.2),
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            );
          },
          filterFn: "auto",
          header: ({ column }) => <span>{capitalizeFirstLetter(key)}</span>,
        } as ColumnDef<any>;

      case "images":
        return {
          ...baseColumn,
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={value} alt="Image" className="max-w-[200px]" />;
          },
          enableColumnFilter: false,
          header: ({ column }) => <span>{capitalizeFirstLetter(key)}</span>,
        } as ColumnDef<any>;

      default:
        return baseColumn as ColumnDef<any>;
    }
  });
};