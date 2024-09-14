"use client";

// import { columns } from "@/components/custom/data-table/columns";
import {
  // data,
  makeFilterFields,
} from "@/components/custom/data-table/constants";
import { DataTable } from "@/components/custom/data-table/data-table";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ColumnDefinitionType, ColumnType, createFilterSchema } from "@/components/custom/data-table/schema";
import { parseCSV } from "@/components/custom/data-table/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DataTableFilterField } from "@/components/custom/data-table/types";
import { type ColumnDef } from "@tanstack/react-table";
import { makeColumns } from "@/components/custom/data-table/columns";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [inputData, setInputData] = useState<string>(""); // For the textarea input
  const [data, setData] = useState<Record<string, unknown>[]>([]); // Parsed data
  const [columnDefinition, setColumnDefinition] = useState<ColumnDefinitionType>({}); // Column types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columns, setColumns] = useState<ColumnDef<string, any>[]>([]);
  const [filterFields, setFilterFields] = useState<DataTableFilterField<string>[]>([]);

  const columnFilterSchema = createFilterSchema(columnDefinition);

  // const search = columnFilterSchema.safeParse(searchParams);
  // const search = searchParams;

  

  useEffect(() => {
    fetch(`/api/views?slug=${"data-table"}`, { method: "POST" });
  }, []);

  // useEffect(() => {
  //   setFilterFields(makeFilterFields(columnDefinition));
  // }, [columnDefinition]);

  // if (!search.success) {
  //   console.log(search.error);
  //   return null;
  // }

  // Handle textarea input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };

  // Parse input data when button is clicked
  const handleParseData = () => {
    try {
      const parsedData = parseCSV(inputData); // This function should parse CSV or JSON
      setData(parsedData);

      console.log('parsedData', parsedData);

      // Get unique column names
      const keys = Object.keys(parsedData[0] || {});

      // If new columns found, add them to columnDefinition with a default "string" type
      const newColumnTypes = { ...columnDefinition };
      keys.forEach((key) => {
        if (!newColumnTypes[key]) {
          newColumnTypes[key] = "string"; // Default type is string, can be changed
        }
      });
      setColumnDefinition(newColumnTypes);

      setColumns(makeColumns(newColumnTypes));
    } catch (error) {
      console.error("Error parsing data", error);
    }
  };

  // Handle column type change
  const handleColumnTypeChange = (column: string, type: ColumnType) => {
    setColumnDefinition((prev) => ({
      ...prev,
      [column]: type,
    }));
  };

  const handleFilterFields = () => {
    setFilterFields(makeFilterFields(columnDefinition, data));
  }

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <div className="mb-4">
          <Textarea
            placeholder="Paste your CSV or JSON here"
            value={inputData}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleParseData}>Parse Data</Button>

        {/* Show column types selector once the data is parsed */}
        {columns.length > 0 && (
          <div>
            {columns.map((column) => (
              <div key={column.id}>
                <Label>{column.id}</Label>
                <Select onValueChange={(value) => handleColumnTypeChange(column.id, value as ColumnType)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={column.id} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="tags">Tags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        <div>
          <Button onClick={handleFilterFields}>Generate Filter Fields</Button>
        </div>
      </div>
      {/* Data table displaying after parsing */}
      <DataTable
        columns={columns}
        data={data}
        filterFields={filterFields}
        columnFilterSchema={columnFilterSchema}
        // defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
        //   id: key,
        //   value,
        // }))}
      />
    </>
  );
}
