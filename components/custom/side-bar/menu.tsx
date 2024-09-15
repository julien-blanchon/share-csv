"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns"; // Add this import
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import { createClient } from '@/utils/supabase/client';

interface MenuProps {
  isOpen: boolean | undefined;
}

interface MenuItem {
  name: string;
  uuid: string;
  createdAt: string; // Make sure this is included
}

interface GroupedMenuItems {
  [date: string]: MenuItem[];
}

export function Menu({ isOpen }: MenuProps) {
  const router = useRouter();
  const [groupedMenuItems, setGroupedMenuItems] = useState<GroupedMenuItems>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserFiles = async () => {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setIsLoading(false);
        return;
      }

      const { data: files, error: filesError } = await supabase
        .from('user_files')
        .select(`
          files (
            id,
            filename,
            schema,
            bucket,
            blob_path,
            created_at
          )
        `)
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
        bucket: file.files.bucket,
        blobPath: file.files.blob_path,
        createdAt: file.files.created_at
      }));

      // Group files by creation date
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

    fetchUserFiles();
  }, []);

  const handleFileClick = (uuid: string) => {
    router.push(`/f/${uuid}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {Object.keys(groupedMenuItems).length > 0 ? (
            Object.entries(groupedMenuItems).map(([date, items]) => (
              <li className="w-full pt-5" key={date}>
                <p className="text-sm font-bold text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {date}
                </p>
                {items.map((item) => (
                  <div className="w-full" key={item.uuid}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-10 mb-1"
                            onClick={() => handleFileClick(item.uuid)}
                          >
                            <p
                              className={cn(
                                "max-w-[200px] truncate",
                                isOpen === false
                                  ? "-translate-x-96 opacity-0"
                                  : "translate-x-0 opacity-100"
                              )}
                            >
                              {item.name}
                            </p>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">{item.name}</TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </li>
            ))
          ) : (
            <li className="w-full pt-5">
              <p className="text-sm text-muted-foreground px-4">No files found</p>
            </li>
          )}
          <li className="w-full grow flex items-end">
            {/* Sign out button (unchanged) */}
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
