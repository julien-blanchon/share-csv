"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { columnType, ColumnType } from './schema'
import { columnTypeIcons } from '@/components/custom/data-table/schema-icons'

interface SelectColTypesProps {
    onSelect: (type: ColumnType) => void;
    isCollapsed?: boolean;
}

export function SelectColTypes({ onSelect, isCollapsed = false }: SelectColTypesProps) {
    const uniqueTypes = Array.from(new Set(Object.values(columnType)));
    const [selectedType, setSelectedType] = React.useState<ColumnType>(uniqueTypes[0]);

    const handleValueChange = (value: string) => {
        const newType = value as ColumnType;
        setSelectedType(newType);
        onSelect(newType);
    };

    return (
        <Select defaultValue={selectedType} onValueChange={handleValueChange}>
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                    "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select column type"
            >
                <SelectValue placeholder="Select a column type">
                    {columnTypeIcons[selectedType]}
                    <span className={cn("ml-2", isCollapsed && "hidden")}>
                        {selectedType}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                            {columnTypeIcons[type]}
                            {type}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}