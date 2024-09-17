"use client";

import { cn } from "@/lib/utils";
import { ColumnDefinitionType, ColumnType } from "./schema";
import type { DataTableFilterField, Option } from "./types";

export const generateColorFromName = (name: string | number, opacity = 1) => {
  if (typeof name !== 'string') {
    name = name.toString();
  }
  // console.log(name) // Consider removing or commenting out for production
  const hash = name
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}${Math.round(opacity * 255)
    .toString(16)
    .toUpperCase()}`;
}

const createLabel = (key: string) => {
  const formattedKey = key.replace(/[_-]/g, ' ');
  return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
};

export const makeFilterFields = (columnDefinition: ColumnDefinitionType, data: Record<string, unknown>[]
) => Object.keys(columnDefinition).map((key) => {
  const col = columnDefinition[key] as { position: number; type: ColumnType };
  const type = col["type"]

  const baseField = {
    label: createLabel(key),
    value: key,
    defaultOpen: true,
  };

  switch (type) {
    case "url":
      return {
        ...baseField,
        type: "input",
        options: data.map((item) => ({
          label: key,
          value: item[key] as string,
        })),
      };

    case "boolean":
      return {
        ...baseField,
        type: "checkbox",
        options: [true, false].map((bool) => ({
          label: `${bool}`,
          value: bool,
        })),
      };

    case "string":
      return {
        ...baseField,
        type: "input",
        options: data.reduce((acc, item) => {
          const values = item[key] as string | string[];
          if (Array.isArray(values)) {
            values.forEach((value) => {
              if (!acc.some((option) => option.value === value)) {
                acc.push({ label: value.toString().slice(0, 8), value });
              }
            });
          } else {
            if (!acc.some((option) => option.value === values)) {
              acc.push({ label: values.toString().slice(0, 10) as string, value: values as string });
            }
          }
          return acc;
        }, [] as Option[]),
      };

    case "images":
      return {
        ...baseField,
        type: "input",
        options: data.reduce((acc, item) => {
          const values = item[key] as string | string[];
          if (Array.isArray(values)) {
            values.forEach((value) => {
              if (!acc.some((option) => option.value === value)) {
                acc.push({ label: value.toString().slice(0, 8), value });
              }
            });
          } else {
            if (!acc.some((option) => option.value === values)) {
              acc.push({ label: values.toString().slice(0, 10) as string, value: values as string });
            }
          }
          return acc;
        }, [] as Option[]),
      };

    case "tags":
      return {
        ...baseField,
        type: "checkbox",
        component: (props: Option) => {
          if (typeof props.value === "boolean") return null;
          if (typeof props.value === "undefined") return null;
          return (
            <div className="flex w-full items-center justify-between gap-2">
              <span className="truncate font-normal">{props.value}</span>
              <span
                className={cn("h-2 w-2 rounded-full")}
                style={{
                  backgroundColor: generateColorFromName(props.value as string),
                }}
              />
            </div>
          );
        },

        options: data.reduce((acc, item) => {
          const values = item[key] as string | string[];
          if (Array.isArray(values)) {
            values.forEach((value) => {
              if (!acc.some((option) => option.value === value)) {
                acc.push({ label: value, value });
              }
            });
          } else {
            if (!acc.some((option) => option.value === values)) {
              acc.push({ label: values as string, value: values as string });
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
        type: "slider",
        min: minValue,
        max: maxValue,
        options: data.map((item) => ({
          label: `${key}`,
          value: key as string,
        })),
      };

    case "date":
      return {
        ...baseField,
        type: "timerange",
        defaultOpen: true,
        commandDisabled: true,
      };

    default:
      return baseField;
  }
});