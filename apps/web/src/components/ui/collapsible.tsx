import * as React from "react"

export interface CollapsibleProps {
  defaultOpen?: boolean
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

const CollapsibleContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export function Collapsible({
  defaultOpen,
  children,
  className,
}: CollapsibleProps & React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(!!defaultOpen)
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div data-state={open ? "open" : "closed"} className={className}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) return null
    const { open, setOpen } = context
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

export const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) return null
    const { open } = context
    if (!open) return null
    return <div ref={ref} {...props} />
  }
)

