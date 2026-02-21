import { cn } from "@/lib/utils";
import * as React from "react";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export { Input };