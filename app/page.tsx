"use client";

import { useEffect } from "react";
import Dropzone from "@/components/custom/dropzone/dropzone";

export default function Page() {
  useEffect(() => {
    fetch(`/api/views?slug=${"data-table"}`, { method: "POST" });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Dropzone />
    </div>
  );
}
