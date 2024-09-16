"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Minus } from "lucide-react";
import { ColumnDefinitionType } from "./schema";
import { format } from "date-fns";
import { generateColorFromName } from "./constants";
import { DataTableColumnHeader } from "./data-table-column-header";
import { LinkPreview } from "@/components/ui/link-preview";

export const makeColumns: (columnDefinition: ColumnDefinitionType) => ColumnDef<any>[] = (columnDefinition) => {
  const columns: ColumnDef<string>[] = Object.entries(columnDefinition).map(([key, type]) => {
    switch (type) {
      case "string":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            // <DataTableColumnHeader type="string" column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <span>{value}</span>
          },
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "number":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
          ),
          filterFn: "auto",
          cell: ({ row }) => {
            const value = row.getValue(key) as number;
            return <span>{value || <Minus className="h-4 w-4 text-muted-foreground/50" />}</span>
          },
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "boolean":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            // <DataTableColumnHeader type="string" column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: (row, id, value) => {
            const rowValue = row.getValue(id);
            if (typeof value === "string") return value === String(rowValue);
            if (typeof value === "boolean") return value === rowValue;
            if (Array.isArray(value)) return value.includes(rowValue);
            return false;
          },
          cell: ({ row }) => {
            const value = row.getValue(key) as boolean;
            return (value ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-muted-foreground/50" />)
          },
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "date":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            // <DataTableColumnHeader type="string" column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            let date: string;
            try {
              date = format(new Date(value), "LLL dd, y HH:mm");
            } catch (error) {
              date = value;
            }

            return (<span className="text-muted-foreground">
              {date}
            </span>);
          },
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "url":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          // cell: ({ row }) => {
          //   const value = row.getValue(key) as string;
          //   return <a href={value} target="_blank" rel="noopener noreferrer">
          //     {value}
          //   </a>
          // },
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <a href={value} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline transition-all">
              {value}
            </a>
          }
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "url_preview":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          // cell: ({ row }) => {
          //   const value = row.getValue(key) as string;
          //   return <a href={value} target="_blank" rel="noopener noreferrer">
          //     {value}
          //   </a>
          // },
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <LinkPreview url={value} className="underline underline-offset-2 hover:no-underline transition-all"
            >{value}</LinkPreview>
          }
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
      case "tags":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            // <DataTableColumnHeader type="string" column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          cell: ({ row }) => {
            const value = row.getValue(key) as string | string[];
            return (
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
                  : <Badge
                    variant="outline"
                    style={{
                      color: generateColorFromName(value, 1),
                      backgroundColor: generateColorFromName(value, 0.1),
                      borderColor: generateColorFromName(value, 0.2),
                    }} className="border-inherit text-xs"
                  >{value}</Badge>}
              </div>
            )
          }
        } as ColumnDef<string>;
      case "images":
        return {
          id: key,
          accessorKey: key,
          header: ({ column }) => (
            // <DataTableColumnHeader type="string" column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          ),
          filterFn: "auto",
          cell: ({ row }) => {
            const value = row.getValue(key) as string;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={value} alt="Image" className="max-w-[200px]" />
          },
          // filterFn: (row, id, value) => "auto"(row, id, value),
        } as ColumnDef<string>;
    }
  }
  );
  return columns;
}

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
//       <DataTableColumnHeader column={column} title={(key) => key.charA) + key.slice(1)} />
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
