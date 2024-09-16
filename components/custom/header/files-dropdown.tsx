'use client';

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure to import the cn utility
import { Plus } from "lucide-react"; // Add this import at the top of the file
import { usePathname } from 'next/navigation'

interface MenuItem {
    name: string;
    uuid: string;
    createdAt: string;
}

interface GroupedMenuItems {
    [date: string]: MenuItem[];
}

export function FilesDropdown() {
    const router = useRouter();
    const [groupedMenuItems, setGroupedMenuItems] = useState<GroupedMenuItems>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [filename, setFilename] = useState(''); // TODO: Get file name from url
    const [user_id, setUserId] = useState('');


    useEffect(() => {
        fetchUserFiles();
    }, []);

    useEffect(() => {
        const getFilename = async () => {
            const filename = await fetchFilename();
            setFilename(filename);
        };
        getFilename();
    }, [pathname]);

    const fetchFilename = async () => {
        const uuid = pathname.split("/").pop();
        if (uuid) {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('files')
                .select('filename')
                .eq('id', uuid)
                .single();

            if (error) {
                console.error('Error fetching filename:', error);
                return '';
            }

            if (data) {
                return data.filename;
            }
        }
        return '';
    };

    const fetchUserFiles = async () => {
        const supabase = createClient();
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
            setIsLoading(false);
            return;
        }

        setUserId(userData.user.id);

        const { data: files, error: filesError } = await supabase
            .from('user_files')
            .select('*, files:files(*)')
            .eq('user_id', userData.user.id)
            .eq('owner', true);

        if (filesError) {
            console.error('Error fetching files:', filesError);
            setIsLoading(false);
            return;
        }

        const formattedFiles = files.map(file => ({
            name: file.files.filename,
            uuid: file.files.id,
            createdAt: file.files.created_at
        }));

        const grouped = formattedFiles.reduce((acc: GroupedMenuItems, file) => {
            const date = format(new Date(file.createdAt), 'MMMM d, yyyy');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(file);
            return acc;
        }, {});

        setGroupedMenuItems(grouped);
        setIsLoading(false);
    };

    const handleFileClick = (uuid: string) => {
        router.push(`/f/${user_id}/${uuid}`);
    };

    return (
        <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-56 justify-between border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="truncate max-w-[80%] text-card-foreground/80 font-semibold" title={filename}>
                        {filename.length > 18 ? `${filename.slice(0, 18)}...` : filename}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 transition-transform ease-in-out duration-500 ml-2 flex-shrink-0",
                            isOpen === false ? "rotate-0" : "rotate-180"
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                    ) : (
                        Object.entries(groupedMenuItems).map(([date, items]) => (
                            <DropdownMenuGroup key={date}>
                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    {date}
                                </DropdownMenuLabel>
                                {items.map((item) => (
                                    <DropdownMenuItem className="text-xs text-card-foreground/80" key={item.uuid} onSelect={() => handleFileClick(item.uuid)}>
                                        {item.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-card-foreground/80">
                    <Link className="flex items-center justify-center w-full"
                        href="/"
                        onClick={() => setIsOpen(false)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Upload a new file</span>
                        {/* TODO: Fix the toggle up when clicking this */}
                    </Link>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
