"use client";

import { columns } from "@/components/custom/data-table/columns";
import {
  data,
  filterFields,
} from "@/components/custom/data-table/constants";
import { DataTable } from "@/components/custom/data-table/data-table";
import { columnFilterSchema } from "@/components/custom/data-table/schema";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = columnFilterSchema.safeParse(searchParams);

  useEffect(() => {
    fetch(`/api/views?slug=${"data-table"}`, { method: "POST" });
  }, []);

  if (!search.success) {
    console.log(search.error);
    return null;
  }

  // todo: get file from supabase using uuid

  return (
    <>
      <div className="mb-4">
        <Textarea placeholder="Copy your csv here" />
      </div>
      <DataTable
        columns={columns}
        data={data}
        filterFields={filterFields}
        defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
          id: key,
          value,
        }))}
      />
    </>
  );
}