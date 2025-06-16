import * as React from "react"

import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "vertical" ? "w-px h-full" : "h-px w-full",
        className
      )}
      {...props}
    />
  )
}
