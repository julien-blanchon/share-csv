"use client";

// import { columns } from "@/components/custom/data-table/columns";
import {
  // data,
  makeFilterFields,
} from "@/components/custom/data-table/constants";
import { DataTable } from "@/components/custom/data-table/data-table";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ColumnDefinitionType, ColumnType, createFilterSchema, getColumnTypes } from "@/components/custom/data-table/schema";
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

const input = `product_id,product_name,product_image_url,price,category,description,in_stock,date_added
1,Red T-shirt,https://images.pexels.com/photos/10026416/pexels-photo-10026416.jpeg,19.99,Clothing,"A comfortable red t-shirt made of cotton",100,2023-09-01
2,Blue Jeans,https://images.pexels.com/photos/3756167/pexels-photo-3756167.jpeg,49.99,Clothing,"Stylish blue jeans with a modern fit",50,2023-09-02
3,Wireless Mouse,https://images.pexels.com/photos/3560567/pexels-photo-3560567.jpeg,29.99,Electronics,"Ergonomic wireless mouse with fast response time",200,2023-09-03
4,Smartphone Case,https://images.pexels.com/photos/5082572/pexels-photo-5082572.jpeg,12.99,Accessories,"Durable smartphone case with shock protection",300,2023-09-04
5,Coffee Mug,https://images.pexels.com/photos/5857549/pexels-photo-5857549.jpeg,8.99,Home Goods,"Ceramic coffee mug with a sleek design",150,2023-09-05
6,Desk Lamp,https://images.pexels.com/photos/1697467/pexels-photo-1697467.jpeg,35.99,Furniture,"Adjustable desk lamp with LED lighting",75,2023-09-06
7,Running Shoes,https://images.pexels.com/photos/789327/pexels-photo-789327.jpeg,59.99,Footwear,"Lightweight running shoes with breathable fabric",90,2023-09-07
8,Laptop Sleeve,https://images.pexels.com/photos/7214738/pexels-photo-7214738.jpeg,25.99,Accessories,"Water-resistant laptop sleeve for 15-inch devices",120,2023-09-08
9,Gaming Headset,https://images.pexels.com/photos/7888076/pexels-photo-7888076.jpeg,79.99,Electronics,"Over-ear gaming headset with surround sound",80,2023-09-09
10,Backpack,https://images.pexels.com/photos/6822433/pexels-photo-6822433.jpeg,45.99,Accessories,"Spacious backpack with multiple compartments",60,2023-09-10
`;

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [inputData, setInputData] = useState<string>(input); // For the textarea input
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
      console.log('parsedData', JSON.stringify(parsedData));

      // If new columns found, add them to columnDefinition with a default "string" type
      const newColumnTypes = getColumnTypes(parsedData);
      setColumnDefinition(newColumnTypes);

      setColumns(makeColumns(newColumnTypes));
    } catch (error) {
      console.error("Error parsing data", error);
    }
  };

  // Handle column type change
  const handleColumnTypeChange = (column: string, type: ColumnType) => {
    const newColumnDefinition = { ...columnDefinition, [column]: type };
    setColumnDefinition(newColumnDefinition);

    // Update columns based on new columnDefinition
    setColumns(makeColumns(newColumnDefinition));

    console.log('columnDefinition updated:', newColumnDefinition);
  };

  useEffect(() => {
    setColumns(makeColumns(columnDefinition));
  }, [columnDefinition]);


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
                    <SelectItem value="images">Images</SelectItem>
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
