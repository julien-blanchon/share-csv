import { ColumnDefinitionType, ColumnType } from "@/components/custom/data-table/schema";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldBeTags(values: any[]): boolean {
  const uniqueValues = new Set(values);
  const totalUnique = uniqueValues.size;
  const totalValues = values.length;
  const duplicates = totalValues - totalUnique;

  // Calculate proportional thresholds
  const maxUniqueRatio = 0.1;
  const minDuplicateRatio = 0.05;

  return (
    totalUnique / totalValues <= maxUniqueRatio &&
    duplicates / totalValues >= minDuplicateRatio
  );
}

// Utility function to get column types for all or random entries
export function getColumnTypes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[], // The data is an array of objects with dynamic keys
  keys: string[] | "all" = "all", // The keys can be provided or can be "all"
  entryLimit: number | "all" = "all" // Limit the number of rows to process or process all rows
): Record<string, { position: number; type: string }> {
  const columns = keys === "all" ? Object.keys(data[0]) : keys;

  // Get entries to check: either all or a random sample
  const rowsToCheck = entryLimit === "all" ? data : getRandomEntries(data, entryLimit);

  const columnTypes: Record<string, { position: number; type: string }> = {}; // Changed to a dict with colname as key

  for (let index = 0; index < columns.length; index++) {
    const key = columns[index];
    const values = rowsToCheck.map(row => row[key]);

    // Check if column should be treated as "tags"
    if (shouldBeTags(values)) {
      columnTypes[key] = { position: index + 1, type: "tags" }; // Updated to use colname as key
    } else {
      // Fallback to detecting individual types
      columnTypes[key] = { position: index + 1, type: detectColumnType(values[0]) }; // Updated to use colname as key
    }
  }

  return columnTypes; // No change needed here
}

// Utility function to get random entries (for sampling)
function getRandomEntries<T>(data: T[], sampleSize: number): T[] {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, sampleSize);
}
