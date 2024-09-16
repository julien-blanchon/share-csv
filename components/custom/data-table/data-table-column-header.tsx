import type { Column } from "@tanstack/react-table";
import { ArrowDown, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span>{title}</span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="w-full data-[state=open]:bg-accent pl-0 text-left align-middle font-medium text-muted-foreground"
    >
      <span
      >{title}</span>
      {!column.getIsSorted() ? (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      ) : <ArrowDown className={cn("ml-2 h-4 w-4 transition-transform",
        column.getIsSorted() === "asc" ? "rotate-180" : "rotate-0")} />}
    </Button>
  );
}
