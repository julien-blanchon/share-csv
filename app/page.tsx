"use client";

import Image from 'next/image'
import { useEffect } from "react";
import Dropzone from "@/components/custom/dropzone/dropzone";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  useEffect(() => {
    fetch(`/api/views?slug=${"data-table"}`, { method: "POST" });
  }, []);

  return (
    <div className="flex flex-col gap-10 justify-center items-center min-h-screen w-full">
      <Dropzone />
      <Separator className="w-1/2" />
      <Image src="/logo_name.svg" alt="Logo" width="300" height="100" />
    </div>
  );
}
