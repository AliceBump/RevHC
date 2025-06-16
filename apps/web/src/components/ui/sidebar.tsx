import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return ctx
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggle = React.useCallback(() => setCollapsed((c) => !c), [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: string
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible, ...props }, ref) => {
    const { collapsed } = useSidebar()
    return (
      <aside
        ref={ref}
        className={cn(
          "bg-background border-r flex flex-col transition-all",
          collapsed ? "w-14" : "w-60",
          className
        )}
        data-collapsible={collapsible}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b p-2", className)} {...props} />
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto p-2", className)} {...props} />
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t p-2", className)} {...props} />
}

export function SidebarRail({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("hidden", className)} {...props} />
}

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col flex-1", className)} {...props} />
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useSidebar()
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn("h-8 w-8 flex items-center justify-center", className)}
      {...props}
    >
      {props.children}
    </button>
  )
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-2 text-sm font-medium", className)} {...props} />
  )
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("grid gap-1 px-2", className)} {...props} />
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={className} {...props} />
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent",
        className
      )}
      {...props}
    />
  )
})

export function SidebarMenuSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("ml-4 grid gap-1", className)} {...props} />
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={className} {...props} />
}

export interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent",
        className
      )}
      {...props}
    />
  )
})

export function SidebarMenuAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex items-center rounded-md p-2 text-muted-foreground hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

