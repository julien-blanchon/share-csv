"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Minus } from "lucide-react";
import { ColumnType, columnType, type ColumnSchema } from "./schema";
// import { isArrayOfDates, isArrayOfNumbers } from "./utils";
// import { DataTableColumnHeader } from "./data-table-column-header";
import { format, isSameDay } from "date-fns";
import { generateColorFromName } from "./constants";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cellRenderers: Record<ColumnType, (value: any) => JSX.Element> = {
  string: (value) => <span>{value}</span>,
  number: (value) => <span>{value || <Minus className="h-4 w-4 text-muted-foreground/50" />}</span>,
  boolean: (value) => (value ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-muted-foreground/50" />),
  date: (value) => <span>{format(new Date(value), "LLL dd, y HH:mm")}</span>,
  url: (value) => <div className="max-w-[200px] truncate">{value}</div>,
  tags: (value) => (
    <div className="flex flex-wrap gap-1">
      {Array.isArray(value)
        ? value.map((v) => (
            <Badge
              key={v}
              variant="outline"
              className="border-inherit text-xs"
              style={{
                color: generateColorFromName(v, 1),
                backgroundColor: generateColorFromName(v, 0.1),
                borderColor: generateColorFromName(v, 0.2),
              }}
            >
              {v}
            </Badge>
          ))
        : value}
    </div>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterFns: Record<ColumnType, (row: any, id: string, value: any) => boolean> = {
  string: (row, id, value) => row.getValue(id).includes(value),
  number: (row, id, value) => {
    const rowValue = row.getValue(id);
    return Array.isArray(value)
      ? value[0] <= rowValue && rowValue <= value[1]
      : rowValue === value;
  },
  boolean: (row, id, value) => row.getValue(id) === value,
  date: (row, id, value) => isSameDay(new Date(row.getValue(id)), new Date(value)),
  url: (row, id, value) => row.getValue(id).includes(value),
  tags: (row, id, value) => {
    const array = row.getValue(id);
    if (typeof value === "string") return array.includes(value);
    return Array.isArray(value) ? value.some((v) => array.includes(v)) : false;
  },
};

// Iterate and dynamically generate columns
export const columns: ColumnDef<ColumnSchema>[] = Object.keys(columnType).map((key) => {
  const accessorKey = key as keyof ColumnSchema;
  const type = columnType[accessorKey];
  
  return {
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1), // Dynamically generate header from key
    cell: ({ row }) => {
      const value = row.getValue(accessorKey);
      return cellRenderers[type](value);
    },
    filterFn: (row, id, value) => filterFns[type](row, id, value),
  };
});

// TODO: Make accessor generic
// export const columns: ColumnDef<ColumnSchema>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//     enableHiding: false,
//   },
//   {
//     accessorKey: "url",
//     header: "URL",
//     cell: ({ row }) => {
//       const value = row.getValue("url");
//       return <div className="max-w-[200px] truncate">{`${value}`}</div>;
//     },
//   },
//   {
//     accessorKey: "regions",
//     header: "Regions",
//     cell: ({ row }) => {
//       const value = row.getValue("regions");
//       if (Array.isArray(value)) {
//         return <div className="text-muted-foreground">{value.join(", ")}</div>;
//       }
//       return <div className="text-muted-foreground">{`${value}`}</div>;
//     },
//     filterFn: (row, id, value) => {
//       const array = row.getValue(id) as string[];
//       if (typeof value === "string") return array.includes(value);
//       // up to the user to define either `.some` or `.every`
//       if (Array.isArray(value)) return value.some((i) => array.includes(i));
//       return false;
//     },
//   },
//   {
//     accessorKey: "tags",
//     header: "Tags",
//     cell: ({ row }) => {
//       const value = row.getValue("tags") as string | string[];
//       if (Array.isArray(value)) {
//         return (
//           <div className="flex flex-wrap gap-1">
//             {value.map((v) => {
//               return (
//                 <Badge key={v}
//                   variant="outline"
//                   className="border-inherit text-xs"
//                   style={{
//                     color: generateColorFromName(v, 1),
//                     backgroundColor: generateColorFromName(v, 0.1),
//                     borderColor: generateColorFromName(v, 0.2),
//                     // hoverBackgroundColor: `${color}/10`,
//                   }}
//                   >
//                   {v}
//                 </Badge>
//               );
//             })}
//           </div>
//         );
//       }
//       return <Badge
//         variant="outline"
//         style={{
//           color: generateColorFromName(value, 1),
//           backgroundColor: generateColorFromName(value, 0.1),
//           borderColor: generateColorFromName(value, 0.2),
//           // hoverBackgroundColor: `${color}/10`,
//         }} className="border-inherit text-xs"
//         >{value}</Badge>;
//     },
//     filterFn: (row, id, value) => {
//       const array = row.getValue(id) as string[];
//       if (typeof value === "string") return array.includes(value);
//       // up to the user to define either `.some` or `.every`
//       if (Array.isArray(value)) return value.some((i) => array.includes(i));
//       return false;
//     },
//   },
//   {
//     accessorKey: "p95",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="P95" />
//     ),
//     cell: ({ row }) => {
//       const value = row.getValue("p95");
//       if (typeof value === "undefined") {
//         return <Minus className="h-4 w-4 text-muted-foreground/50" />;
//       }
//       return (
//         <div>
//           <span className="font-mono">{`${value}`}</span> ms
//         </div>
//       );
//     },
//     filterFn: (row, id, value) => {
//       const rowValue = row.getValue(id) as number;
//       if (typeof value === "number") return value === Number(rowValue);
//       if (Array.isArray(value) && isArrayOfNumbers(value)) {
//         const sorted = value.sort((a, b) => a - b);
//         return sorted[0] <= rowValue && rowValue <= sorted[1];
//       }
//       return false;
//     },
//   },
//   {
//     accessorKey: "active",
//     header: "Active",
//     cell: ({ row }) => {
//       const value = row.getValue("active");
//       if (value) return <Check className="h-4 w-4" />;
//       return <Minus className="h-4 w-4 text-muted-foreground/50" />;
//     },
//     filterFn: (row, id, value) => {
//       const rowValue = row.getValue(id);
//       if (typeof value === "string") return value === String(rowValue);
//       if (typeof value === "boolean") return value === rowValue;
//       if (Array.isArray(value)) return value.includes(rowValue);
//       return false;
//     },
//   },
//   {
//     accessorKey: "public",
//     header: "Public",
//     cell: ({ row }) => {
//       const value = row.getValue("public");
//       if (value) return <Check className="h-4 w-4" />;
//       return <Minus className="h-4 w-4 text-muted-foreground/50" />;
//     },
//     filterFn: (row, id, value) => {
//       const rowValue = row.getValue(id);
//       if (typeof value === "string") return value === String(rowValue);
//       if (typeof value === "boolean") return value === rowValue;
//       if (Array.isArray(value)) return value.includes(rowValue);
//       return false;
//     },
//   },
//   {
//     accessorKey: "date",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Date" />
//     ),
//     cell: ({ row }) => {
//       const value = row.getValue("date");
//       return (
//         <div className="text-xs text-muted-foreground">
//           {format(new Date(`${value}`), "LLL dd, y HH:mm")}
//         </div>
//       );
//     },
//     filterFn: (row, id, value) => {
//       const rowValue = row.getValue(id);
//       if (value instanceof Date && rowValue instanceof Date) {
//         return isSameDay(value, rowValue);
//       }
//       if (Array.isArray(value)) {
//         if (isArrayOfDates(value) && rowValue instanceof Date) {
//           const sorted = value.sort((a, b) => a.getTime() - b.getTime());
//           return (
//             sorted[0].getTime() <= rowValue.getTime() &&
//             rowValue.getTime() <= sorted[1].getTime()
//           );
//         }
//       }
//       return false;
//     },
//   },
// ];
