"use client";

import { ColumnDefinitionType, ColumnType } from "./schema";
import type { DataTableFilterField, Option } from "./types";

export const generateColorFromName = (name: string, opacity = 1) => {
  const hash = name
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}${Math.round(opacity * 255)
    .toString(16)
    .toUpperCase()}`;
}

// export const filterFields = [
//   {
//     label: "Time Range",
//     value: "date",
//     type: "timerange",
//     defaultOpen: true,
//     commandDisabled: true,
//   },
//   {
//     label: "URL",
//     value: "url",
//     type: "input",
//     options: data.map(({ url }) => ({ label: url, value: url })),
//   },
//   {
//     label: "URL2",
//     value: "url2",
//     type: "input",
//     options: data.map(({ url2 }) => ({ label: url2, value: url2 })),
//   },
//   {
//     label: "Public",
//     value: "public",
//     type: "checkbox",
//     options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
//   },
//   {
//     label: "Active",
//     value: "active",
//     type: "checkbox",
//     options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
//   },
//   {
//     label: "P95",
//     value: "p95",
//     type: "slider",
//     min: 0,
//     max: 3000,
//     options: data.map(({ p95 }) => ({ label: `${p95}`, value: p95 })),
//     defaultOpen: true,
//   },
//   {
//     label: "Regions",
//     value: "regions",
//     type: "checkbox",
//     // Get unique values from the data
//     options: data.reduce((acc, { regions }) => {
//       if (Array.isArray(regions)) {
//         regions.forEach((region) => {
//           if (!acc.some((option) => option.value === region)) {
//             acc.push({ label: region, value: region });
//           }
//         });
//       }
//       return acc;
//     }
//     , [] as Option[]),
//   },
//   {
//     label: "Tags",
//     value: "tags",
//     type: "checkbox",
//     defaultOpen: true,
//     // REMINDER: "use client" needs to be declared in the file - otherwise getting serialization error from Server Component
//     component: (props: Option) => {
//       if (typeof props.value === "boolean") return null;
//       if (typeof props.value === "undefined") return null;
//       return (
//         <div className="flex w-full items-center justify-between gap-2">
//           <span className="truncate font-normal">{props.value}</span>
//           <span
//             className={cn("h-2 w-2 rounded-full")}
//             style={{ backgroundColor: generateColorFromName(props.value as string) }}
//           />
//         </div>
//       );
//     },
//     options: data.reduce((acc, { tags }) => {
//       if (Array.isArray(tags)) {
//         tags.forEach((tag) => {
//           if (!acc.some((option) => option.value === tag)) {
//             acc.push({ label: tag, value: tag });
//           }
//         });
//       }
//       return acc;
//     }
//     , [] as Option[]),
//   },
// ] satisfies DataTableFilterField<ColumnSchema>[];

const filterTypeMap: Record<ColumnType, string> = {
  string: "input",
  number: "slider",
  boolean: "checkbox",
  date: "timerange",
  url: "input",
  tags: "checkbox",
  images: "input",
};

// export const filterFields = Object.keys(columnType).map((key) => {
//   const type = columnType[key];
  
//   const baseField = {
//     label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the label
//     value: key,
//     type: filterTypeMap[type],
//   };

//   // Generate options for specific field types
//   switch (type) {
//     case "url":
//       return {
//         ...baseField,
//         options: data.map((item) => ({
//           label: item[key],
//           value: item[key],
//         })),
//       };

//     case "boolean":
//       return {
//         ...baseField,
//         options: [true, false].map((bool) => ({
//           label: `${bool}`,
//           value: bool,
//         })),
//       };

//     case "tags":
//     case "string":
//       return {
//         ...baseField,
//         options: data.reduce((acc, item) => {
//           const values = item[key];
//           if (Array.isArray(values)) {
//             values.forEach((value) => {
//               if (!acc.some((option) => option.value === value)) {
//                 acc.push({ label: value, value });
//               }
//             });
//           }
//           return acc;
//         }, [] as Option[]),
//       };

//     case "number":
//       const values = data.map((item) => item[key] || 0) as number[];
//       const minValue = Math.min(...values);
//       const maxValue = Math.max(...values);
//       return {
//         ...baseField,
//         min: minValue,
//         max: maxValue,
//         options: data.map((item) => ({
//           label: `${item[key]}`,
//           value: item[key],
//         })),
//       };

//     case "date":
//       return {
//         ...baseField,
//         defaultOpen: true,
//         commandDisabled: true,
//       };

//     default:
//       return baseField;
//   }
// }) satisfies DataTableFilterField<string>[];

export const makeFilterFields = (columnDefinition: ColumnDefinitionType, data: Record<string, unknown>[]
) => Object.keys(columnDefinition).map((key) => {
  const type = columnDefinition[key];
  
  const baseField = {
    label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the label
    value: key,
    type: filterTypeMap[type],
  };
  console.log('data', data);
  // Generate options for specific field types
  switch (type) {
    case "url":
      return {
        ...baseField,
        options: data.map((item) => ({
          label: item[key],
          value: item[key],
        })),
      };

    case "boolean":
      return {
        ...baseField,
        options: [true, false].map((bool) => ({
          label: `${bool}`,
          value: bool,
        })),
      };
    case "images":
    case "tags":
    case "string":
      return {
        ...baseField,
        options: data.reduce((acc, item) => {
          const values = item[key];
          if (Array.isArray(values)) {
            values.forEach((value) => {
              if (!acc.some((option) => option.value === value)) {
                acc.push({ label: value, value });
              }
            });
          } else {
            if (!acc.some((option) => option.value === values)) {
              acc.push({ label: values as string, value: values as string});
            }
          }
          return acc;
        }, [] as Option[]),
      };

    case "number":
      const values = data.map((item) => item[key] || 0) as number[];
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      return {
        ...baseField,
        min: minValue,
        max: maxValue,
        options: data.map((item) => ({
          label: `${item[key]}`,
          value: item[key] as string,
        })),
      };

    case "date":
      return {
        ...baseField,
        defaultOpen: true,
        commandDisabled: true,
      };

    default:
      return baseField;
  }
}) satisfies DataTableFilterField<string>[];