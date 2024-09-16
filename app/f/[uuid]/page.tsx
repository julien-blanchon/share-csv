"use client";

import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { parseCSV } from "@/components/custom/data-table/utils";
import { DataTable } from "@/components/custom/data-table/data-table";
import { ColumnDefinitionType, ColumnType, createFilterSchema } from "@/components/custom/data-table/schema";
import { makeFilterFields } from "@/components/custom/data-table/constants";
import { makeColumns } from "@/components/custom/data-table/columns";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [csvData, setCsvData] = useState<Record<string, any>[]>([]);
    const [columns, setColumns] = useState<ColumnDef<string>[]>([]);
    const [filterFields, setFilterFields] = useState([]);
    const [columnDefinition, setColumnDefinition] = useState<ColumnDefinitionType>({}); // Column types
    const [columnFilterSchema, setColumnFilterSchema] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const uuid = pathname.split("/").pop(); // Get the UUID from the pathname
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
                // Get user info
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                const userId = userData?.user?.id;
                const fileExtension = "csv";
                const fileName = `${uuid}.${fileExtension}`;
                const filePath = `${userId}/${fileName}`;

                // Download the CSV file from Supabase storage
                const { data: fileData, error: fileError } = await supabase.storage.from("files").download(filePath);
                if (fileError) throw fileError;

                // Convert file to text and parse it
                const csvText = await fileData.text();
                console.log("csvText", csvText);
                const parsedData = parseCSV(csvText);
                console.log("parsedData", parsedData);

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

                console.log("newColumnTypes", newColumnTypes);

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
        setFilterFields(makeFilterFields(columnDefinition, csvData));
    }, [columnDefinition, csvData]);

    useEffect(() => {
        setColumnFilterSchema(createFilterSchema(columnDefinition));
    }, [columnDefinition]);

    useEffect(() => {
        setColumns(makeColumns(columnDefinition));
    }, [columnDefinition]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto h-full">
            {
                columns.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {columns.map((column) => (
                            column.id !== undefined && (
                                <div key={column.id}>
                                    <Label>{column.id}</Label>
                                    <Select onValueChange={(value) => handleColumnTypeChange(column.id as string, value as ColumnType)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={column.id} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="string">String</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="boolean">Boolean</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="url">URL</SelectItem>
                                            <SelectItem value="url_preview">URL Preview</SelectItem>
                                            <SelectItem value="tags">Tags</SelectItem>
                                            <SelectItem value="images">Images</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        ))}
                    </div>
                )
            }
            <div>
                <DataTable
                    columns={columns}
                    data={csvData}
                    filterFields={filterFields}
                    columnFilterSchema={columnFilterSchema}
                // defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
                //   id: key,
                //   value,
                // }))}
                />
            </div>
        </div>
    );
}
