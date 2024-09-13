"use client";

import { cn } from "@/lib/utils";
import { ColumnType, columnType, type ColumnSchema } from "./schema";
import type { DataTableFilterField, Option } from "./types";
import { subDays, subHours, subMinutes } from "date-fns";

export const generateColorFromName = (name: string, opacity = 1) => {
  const hash = name
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}${Math.round(opacity * 255)
    .toString(16)
    .toUpperCase()}`;
}

export const data = [
  {
    name: "Edge Api",
    url: "edge-api.acme.com/health",
    url2: "edge-api.acme.com/health",
    p95: 140,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api", "enterprise"],
    date: subHours(new Date(), 1),
  },
  {
    name: "Lambda Api",
    url: "lambda-api.acme.com/health",
    url2: "lambda-api.acme.com/health",
    p95: 203,
    public: true,
    active: true,
    regions: ["ams", "gru", "syd"],
    tags: ["api"],
    date: subHours(new Date(), 10),
  },
  {
    name: "Storybook",
    url: "storybook.acme.com",
    url2: "storybook.acme.com",
    p95: 1252,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
    date: subMinutes(new Date(), 10),
  },
  {
    name: "Marketing",
    url: "acme.com",
    url2: "acme.com",
    p95: 659,
    public: true,
    active: true,
    regions: ["hkg", "fra", "iad"],
    tags: ["web"],
    date: subDays(new Date(), 1),
  },
  {
    name: "App",
    url: "app.acme.com",
    url2: "app.acme.com",
    p95: 1301,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["app"],
    date: subHours(new Date(), 13),
  },
  {
    name: "Demo",
    url: "demo.acme.com",
    url2: "demo.acme.com",
    p95: 2420,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web", "enterprise"],
    date: subDays(new Date(), 4),
  },
  {
    name: "Documentation",
    url: "docs.acme.com",
    url2: "docs.acme.com",
    p95: 943,
    public: true,
    active: true,
    regions: ["ams"],
    tags: ["api", "web"],
    date: subDays(new Date(), 6),
  },
  {
    name: "Boilerplate",
    url: "boilerplate.acme.com",
    url2: "boilerplate.acme.com",
    p95: undefined,
    public: true,
    active: false,
    regions: ["gru", "fra"],
    tags: ["web"],
    date: subDays(new Date(), 10),
  },
  {
    name: "Dashboard",
    url: "app.acme.com/dashboard",
    url2: "app.acme.com/dashboard",
    p95: 967,
    public: false,
    active: true,
    regions: ["iad", "fra"],
    tags: ["web"],
    date: subHours(new Date(), 28),
  },
  {
    name: "E2E Testing",
    url: "staging-cypress-e2e.acme.com",
    url2: "staging-cypress-e2e.acme.com",
    p95: 1954,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["web"],
    date: subDays(new Date(), 12),
  },
  {
    name: "Web App",
    url: "web-app.acme.com",
    url2: "web-app.acme.com",
    p95: 1043,
    public: true,
    active: true,
    regions: ["iad"],
    tags: ["web"],
    date: subDays(new Date(), 15),
  },
  {
    name: "Admin Panel",
    url: "admin.acme.com",
    url2: "admin.acme.com",
    p95: 1342,
    public: false,
    active: true,
    regions: ["gru", "syd"],
    tags: ["web"],
    date: subHours(new Date(), 5),
  },
  {
    name: "API Gateway",
    url: "api-gateway.acme.com/health",
    url2: "api-gateway.acme.com/health",
    p95: 190,
    public: true,
    active: true,
    regions: ["ams", "hkg"],
    tags: ["api", "enterprise"],
    date: subHours(new Date(), 3),
  },
  {
    name: "Analytics Service",
    url: "analytics.acme.com",
    url2: "analytics.acme.com",
    p95: 810,
    public: true,
    active: true,
    regions: ["iad", "fra", "hkg"],
    tags: ["app", "enterprise"],
    date: subDays(new Date(), 2),
  },
  {
    name: "Support Portal",
    url: "support.acme.com",
    url2: "support.acme.com",
    p95: 752,
    public: true,
    active: true,
    regions: ["gru", "iad"],
    tags: ["web"],
    date: subMinutes(new Date(), 30),
  },
  {
    name: "User Management",
    url: "user-mgmt.acme.com",
    url2: "user-mgmt.acme.com",
    p95: 980,
    public: false,
    active: true,
    regions: ["gru", "syd", "fra"],
    tags: ["app"],
    date: subDays(new Date(), 7),
  },
  {
    name: "Payment Gateway",
    url: "payments.acme.com",
    url2: "payments.acme.com",
    p95: 156,
    public: true,
    active: true,
    regions: ["ams", "hkg", "syd"],
    tags: ["api", "enterprise"],
    date: subHours(new Date(), 8),
  },
  {
    name: "Notification Service",
    url: "notifications.acme.com",
    url2: "notifications.acme.com",
    p95: 345,
    public: false,
    active: true,
    regions: ["iad"],
    tags: ["api"],
    date: subDays(new Date(), 11),
  },
  {
    name: "File Storage",
    url: "storage.acme.com",
    url2: "storage.acme.com",
    p95: 1220,
    public: true,
    active: true,
    regions: ["gru", "hkg"],
    tags: ["web", "enterprise"],
    date: subDays(new Date(), 3),
  },
  {
    name: "CDN",
    url: "cdn.acme.com",
    url2: "cdn.acme.com",
    p95: 89,
    public: true,
    active: true,
    regions: ["ams", "iad", "hkg"],
    tags: ["web"],
    date: subDays(new Date(), 2),
  },
  {
    name: "Authentication Service",
    url: "auth.acme.com",
    url2: "auth.acme.com",
    p95: 542,
    public: false,
    active: true,
    regions: ["gru", "syd"],
    tags: ["api"],
    date: subHours(new Date(), 16),
  },
] satisfies ColumnSchema[];

export const filterFields = [
  {
    label: "Time Range",
    value: "date",
    type: "timerange",
    defaultOpen: true,
    commandDisabled: true,
  },
  {
    label: "URL",
    value: "url",
    type: "input",
    options: data.map(({ url }) => ({ label: url, value: url })),
  },
  {
    label: "URL2",
    value: "url2",
    type: "input",
    options: data.map(({ url2 }) => ({ label: url2, value: url2 })),
  },
  {
    label: "Public",
    value: "public",
    type: "checkbox",
    options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
  },
  {
    label: "Active",
    value: "active",
    type: "checkbox",
    options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
  },
  {
    label: "P95",
    value: "p95",
    type: "slider",
    min: 0,
    max: 3000,
    options: data.map(({ p95 }) => ({ label: `${p95}`, value: p95 })),
    defaultOpen: true,
  },
  {
    label: "Regions",
    value: "regions",
    type: "checkbox",
    // Get unique values from the data
    options: data.reduce((acc, { regions }) => {
      if (Array.isArray(regions)) {
        regions.forEach((region) => {
          if (!acc.some((option) => option.value === region)) {
            acc.push({ label: region, value: region });
          }
        });
      }
      return acc;
    }
    , [] as Option[]),
  },
  {
    label: "Tags",
    value: "tags",
    type: "checkbox",
    defaultOpen: true,
    // REMINDER: "use client" needs to be declared in the file - otherwise getting serialization error from Server Component
    component: (props: Option) => {
      if (typeof props.value === "boolean") return null;
      if (typeof props.value === "undefined") return null;
      return (
        <div className="flex w-full items-center justify-between gap-2">
          <span className="truncate font-normal">{props.value}</span>
          <span
            className={cn("h-2 w-2 rounded-full")}
            style={{ backgroundColor: generateColorFromName(props.value as string) }}
          />
        </div>
      );
    },
    options: data.reduce((acc, { tags }) => {
      if (Array.isArray(tags)) {
        tags.forEach((tag) => {
          if (!acc.some((option) => option.value === tag)) {
            acc.push({ label: tag, value: tag });
          }
        });
      }
      return acc;
    }
    , [] as Option[]),
  },
] satisfies DataTableFilterField<ColumnSchema>[];

// const filterTypeMap: Record<ColumnType, string> = {
//   string: "input",
//   number: "slider",
//   boolean: "checkbox",
//   date: "timerange",
//   url: "input",
//   tags: "checkbox",
// };

// export const filterFields = Object.keys(columnType).map((key) => {
//   const accessorKey = key as keyof ColumnSchema;
//   const type = columnType[accessorKey];
  
//   const baseField = {
//     label: accessorKey.charAt(0).toUpperCase() + accessorKey.slice(1), // Capitalize the label
//     value: accessorKey,
//     type: filterTypeMap[type],
//   };

//   // Generate options for specific field types
//   switch (type) {
//     case "url":
//       return {
//         ...baseField,
//         options: data.map((item) => ({
//           label: item[accessorKey],
//           value: item[accessorKey],
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
//           const values = item[accessorKey];
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
//       const values = data.map((item) => item[accessorKey] || 0) as number[];
//       const minValue = Math.min(...values);
//       const maxValue = Math.max(...values);
//       return {
//         ...baseField,
//         min: minValue,
//         max: maxValue,
//         options: data.map((item) => ({
//           label: `${item[accessorKey]}`,
//           value: item[accessorKey],
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
// }) satisfies DataTableFilterField<ColumnSchema>[];