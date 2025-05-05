
import { cn } from "@/utils/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "w-full bg-white dark:bg-[#1a1a1a] border rounded-xl flex py-4 shadow-sm",
        props.className
      )}
    />
  );
}
