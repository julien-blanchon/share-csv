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
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .array()
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
