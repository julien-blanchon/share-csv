"use client";
import { z } from "zod";

/** Delimiters used for URL params */
export const ARRAY_DELIMITER = ",";
export const SLIDER_DELIMITER = "-";
export const SPACE_DELIMITER = "_";
export const RANGE_DELIMITER = "-";

/** Column types definition */
export type ColumnType = "string" | "number" | "boolean" | "date" | "url" | "tags" | "images";
export type ColumnDefinitionType = Record<string, ColumnType>;

/** Predefined enums */
export const REGIONS = ["ams", "gru", "syd", "hkg", "fra", "iad"] as const;
export const TAGS = ["web", "api", "enterprise", "app"] as const;

/** Helper function to convert strings to booleans */
const stringToBoolean = z
  .string()
  .toLowerCase()
  .transform((val) => {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  })
  .pipe(z.boolean().optional());

/** Schema factory for each column type */
const getColumnSchema = (type: ColumnType) => {
  switch (type) {
    case "string":
      return z.string();
    case "number":
      return z.number().optional();
    case "boolean":
      return z.boolean();
    case "date":
      return z.date();
    case "url":
      return z.string().url();
    case "tags":
      return z.string().array();
    case "images":
      return z.string().array();
    default:
      throw new Error(`Unsupported column type: ${type}`);
  }
};

export const createColumnSchema = (columnDefinition: ColumnDefinitionType) => {
  const schema = z.object(
    Object.fromEntries(
      Object.entries(columnDefinition).map(([key, type]) => [
        key,
        getColumnSchema(type),
      ])
    )
  );
  return schema;
}

/** Schema factory for each column type for filtering */
const getFilterSchema = (type: ColumnType) => {
  switch (type) {
    case "string":
      return z.string().optional();
    case "number":
      return z
        .coerce
        .number()
        .or(
          z
            .string()
            .transform((val) => val.split(SLIDER_DELIMITER))
            .pipe(z.coerce.number().array().length(2))
        )
        .optional();
    case "boolean":
      return z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .pipe(stringToBoolean.array())
        .optional();
    case "date":
      return z.coerce
        .number()
        .pipe(z.coerce.date())
        .or(
          z
            .string()
            .transform((val) => val.split(RANGE_DELIMITER).map(Number))
            .pipe(z.coerce.date().array())
        )
        .optional();
    case "url":
      return z.string().optional();
    case "tags":
      return z
        .enum(TAGS)
        .or(
          z
            .string()
            .transform((val) => val.split(ARRAY_DELIMITER))
            .pipe(z.enum(TAGS).array())
        )
        .optional();
    case "images":
      return z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .array()
        .optional();
    default:
      throw new Error(`Unsupported column type for filtering: ${type}`);
  }
};

export const createFilterSchema = (columnDefinition: ColumnDefinitionType) => {
  const schema = z.object(
    Object.fromEntries(
      Object.entries(columnDefinition).map(([key, type]) => [
        key,
        getFilterSchema(type),
      ])
    )
  );
  return schema;
}
// Function to detect basic types
function detectColumnType(value: string | number | boolean | string[] | Date): ColumnType {
  if (typeof value === 'string' && value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
    return "images";
  }
  if (typeof value === 'string' && value.match(/^https?:\/\/.+/)) {
    return "url";
  }
  if (Array.isArray(value)) {
    return "tags";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  if (typeof value === "number") {
    return "number";
  }
  if (value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value)))) {
    return "date";
  }
  return "string";
}

function shouldBeTags(values: any[]): boolean {
  const uniqueValues = new Set(values);
  const totalUnique = uniqueValues.size;
  const duplicates = values.length - totalUnique;

  // Assign "tags" type if there are fewer than 100 unique values and more than 10 duplicates
  console.log('totalUnique', totalUnique);
  console.log('duplicates', duplicates);
  return totalUnique < 100 && duplicates > 3;
}

// Utility function to get column types for all or random entries
export function getColumnTypes(
  data: Record<string, any>[], // The data is an array of objects with dynamic keys
  keys: string[] | "all" = "all", // The keys can be provided or can be "all"
  entryLimit: number | "all" = "all" // Limit the number of rows to process or process all rows
): ColumnDefinitionType {
  const columns = keys === "all" ? Object.keys(data[0]) : keys;

  // Get entries to check: either all or a random sample
  const rowsToCheck = entryLimit === "all" ? data : getRandomEntries(data, entryLimit);

  const columnTypes: ColumnDefinitionType = {};

  for (const key of columns) {
    const values = rowsToCheck.map(row => row[key]);

    // Check if column should be treated as "tags"
    if (shouldBeTags(values)) {
      columnTypes[key] = "tags";
    } else {
      // Fallback to detecting individual types
      columnTypes[key] = detectColumnType(values[0]);
    }
  }

  return columnTypes;
}

// Utility function to get random entries (for sampling)
function getRandomEntries<T>(data: T[], sampleSize: number): T[] {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, sampleSize);
}
