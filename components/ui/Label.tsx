import { cn } from "@/lib/utils";
import * as React from "react";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-xs text-white/50 font-medium", className)}
      {...props}
    />
  );
}

export { Label };