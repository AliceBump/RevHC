import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const ctx = React.useContext(DropdownContext)
    if (!ctx) return null
    const { open, setOpen } = ctx
    return (
      <button
        ref={ref}
        onClick={(e) => {
          setOpen(!open)
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(DropdownContext)
    if (!ctx) return null
    const { open } = ctx
    if (!open) return null
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md",
          className
        )}
        {...props}
      />
    )
  }
)

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
        className
      )}
      {...props}
    />
  )
)

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  )
)

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  )
)

export const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

export const DropdownMenuShortcut = ({ children }: { children: React.ReactNode }) => (
  <span className="ml-auto text-xs tracking-widest opacity-60">{children}</span>
)

