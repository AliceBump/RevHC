import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'relative w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden',
        className,
      )}
    >
      <User className="w-5 h-5 text-muted-foreground" />
      <span
        className="absolute bottom-0 right-0 mb-0.5 mr-0.5 rounded bg-primary text-primary-foreground text-[8px] leading-none flex items-center justify-center w-4 h-4"
      >
        {initials}
      </span>
    </div>
  )
}
