import { ColumnDefinitionType, ColumnType } from "@/components/custom/data-table/schema";

// Function to detect basic types
function detectColumnType(values: number[] | boolean[] | string[] | Date[]): ColumnType {
  const value = values[0]

  if (typeof value === 'string' && value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i)) {
    return "images";
  }
  if (typeof value === 'string' && value.match(/^https?:\/\/.+/)) {
    return "url";
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
  if (Array.isArray(value) || shouldBeTags(values)) {
    return "tags";
  }
  return "string";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldBeTags(values: any[]): boolean {
  const uniqueValues = new Set(values);
  const totalUnique = uniqueValues.size;
  const totalValues = values.length;
  const duplicates = totalValues - totalUnique;

  // Calculate proportional thresholds
  const maxUniqueRatio = 0.6;
  const minDuplicateRatio = 0.05;

  return (
    totalUnique / totalValues <= maxUniqueRatio &&
    duplicates / totalValues >= minDuplicateRatio
  );
}

// Utility function to get column types for all or random entries
export function getColumnTypes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  keys: string[] | "all" = "all",
  entryLimit: number | "all" = "all"
): Record<string, { position: number; type: string }> {
  const columns = keys === "all" ? Object.keys(data[0]) : keys;

  // Get entries to check: either all or a random sample
  const rowsToCheck = entryLimit === "all" ? data : getRandomEntries(data, entryLimit);

  const columnTypes: Record<string, { position: number; type: string }> = {};

  for (let index = 0; index < columns.length; index++) {
    const key = columns[index];
    const values = rowsToCheck.map(row => row[key]);

    columnTypes[key] = { position: index + 1, type: detectColumnType(values) };
  }

  return columnTypes; // No change needed here
}

// Utility function to get random entries (for sampling)
function getRandomEntries<T>(data: T[], sampleSize: number): T[] {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, sampleSize);
}
