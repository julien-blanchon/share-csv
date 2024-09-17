"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { parseCSV } from "@/components/custom/data-table/utils";
import { DataTable } from "@/components/custom/data-table/data-table";
import { type ColumnDefinitionType, type ColumnType, createFilterSchema } from "@/components/custom/data-table/schema";
import { makeFilterFields } from "@/components/custom/data-table/constants";
import { makeColumns } from "@/components/custom/data-table/columns";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label"
import { z } from "zod";

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [csvData, setCsvData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
    const [filterFields, setFilterFields] = useState([]);
    const [columnDefinition, setColumnDefinition] = useState<ColumnDefinitionType>({}); // Column types
    const [columnFilterSchema, setColumnFilterSchema] = useState<z.ZodObject<Record<string, z.ZodType>>>(z.object({}));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const userId = pathname.split("/")[2]; // Get the user ID from the pathname
    const uuid = pathname.split("/")?.[3]; // Get the UUID from the pathname
    const supabase = createClient();

    // Handle column type change
    const handleColumnTypeChange = (column: string, type: ColumnType) => {
        setColumnDefinition((prev) => ({
            ...prev,
            [column]: type,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fileExtension = "csv";
                const fileName = `${uuid}.${fileExtension}`;
                const filePath = `${userId}/${fileName}`;

                // Download the CSV file from Supabase storage
                const { data: fileData, error: fileError } = await supabase.storage.from("files").download(filePath);
                if (fileError) throw fileError;

                // Convert file to text and parse it
                const csvText = await fileData.text();
                const parsedData = parseCSV(csvText);

                // Set the parsed CSV data in state
                setCsvData(parsedData);

                const { data: fileSchemaData, error: fileSchemaError } = await supabase
                    .from("files")
                    .select("schema")
                    .eq("id", uuid).single();

                if (fileSchemaError) throw fileSchemaError;

                const defaultColumnTypes = Object.fromEntries(
                    Object.keys(parsedData[0]).map((key) => [key, "string"])
                ) as ColumnDefinitionType;

                const newColumnTypes = (fileSchemaData.schema || defaultColumnTypes) as ColumnDefinitionType;
                
                setColumnDefinition(newColumnTypes);
                setColumns(makeColumns(newColumnTypes));
            } catch (err) {
                setError("Failed to fetch CSV data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase, uuid]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFilterFields(makeFilterFields(columnDefinition, csvData));
    }, [columnDefinition, csvData]);

    useEffect(() => {
        setColumnFilterSchema(createFilterSchema(columnDefinition));
    }, [columnDefinition]);

    useEffect(() => {
        setColumns(makeColumns(columnDefinition));
    }, [columnDefinition]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-3xl flex items-center justify-center h-full">
        {error}
    </div>;

    return (
        <div className="container mx-auto h-full">
            <div>
                <DataTable
                    columns={columns}
                    data={csvData}
                    filterFields={filterFields}
                    columnFilterSchema={columnFilterSchema}
                    columnDefinition={columnDefinition}
                    handleColumnTypeChange={handleColumnTypeChange}
                // defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
                //   id: key,
                //   value,
                // }))}
                />
            </div>
        </div>
    );
}
