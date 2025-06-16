import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  RectangleHorizontal,
  Plus,
} from 'lucide-react'

export interface Concern {
  id: number
  title: string
  diagnosis: string
  date: string
}

const initialConcerns: Concern[] = [
  { id: 3, title: 'Headache', diagnosis: 'Migraine', date: '2024-06-05' },
  { id: 2, title: 'Cough', diagnosis: 'Flu', date: '2024-06-01' },
  { id: 1, title: 'Stomach Pain', diagnosis: 'Indigestion', date: '2024-05-28' },
]

export default function HomeDashboard({
  onSelectConcern,
}: {
  onSelectConcern: (c: Concern) => void
}) {
  const [layout, setLayout] = useState<'latest' | 'date'>('latest')
  const [groupBy, setGroupBy] = useState<'none' | 'week' | 'month' | 'year'>('none')
  const [reverse, setReverse] = useState(false)
  const [shape, setShape] = useState<'rect' | 'square'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboard-shape') as
        | 'rect'
        | 'square'
        | null
      if (stored) {
        return stored
      }
    }
    return 'square'
  })

  const [concerns, setConcerns] = useState<Concern[]>(initialConcerns)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-shape', shape)
    }
  }, [shape])

  const sorted = [...concerns].sort((a, b) => {
    if (layout === 'latest') {
      return b.id - a.id
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  if (reverse) {
    sorted.reverse()
  }

  function getWeekNumber(date: Date) {
    const firstDay = new Date(date.getFullYear(), 0, 1)
    const pastDays =
      (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7)
  }

  const effectiveGroupBy = layout === 'date' ? groupBy : 'none'

  const groups = (() => {
    if (effectiveGroupBy === 'none') {
      return [{ label: '', items: sorted }]
    }
    const map: Record<string, Concern[]> = {}
    for (const c of sorted) {
      const d = new Date(c.date)
      let key = ''
      if (effectiveGroupBy === 'year') {
        key = d.getFullYear().toString()
      } else if (effectiveGroupBy === 'month') {
        key = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`
      } else if (effectiveGroupBy === 'week') {
        key = `Week ${getWeekNumber(d)} ${d.getFullYear()}`
      }
      map[key] ??= []
      map[key].push(c)
    }
    return Object.entries(map).map(([label, items]) => ({ label, items }))
  })()

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const nextId = concerns.reduce((m, c) => Math.max(m, c.id), 0) + 1
            const newConcern = {
              id: nextId,
              title: 'New Concern',
              diagnosis: 'Pending',
              date: new Date().toISOString().split('T')[0],
            }
            setConcerns((cs) => [newConcern, ...cs])
            onSelectConcern(newConcern)
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLayout(layout === 'latest' ? 'date' : 'latest')}
        >
          {layout === 'latest' ? (
            <Clock className="h-4 w-4" />
          ) : (
            <CalendarDays className="h-4 w-4" />
          )}
        </Button>
        {layout === 'date' && (
          <select
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as 'none' | 'week' | 'month' | 'year')
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="none">No grouping</option>
            <option value="week">By week</option>
            <option value="month">By month</option>
            <option value="year">By year</option>
          </select>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setReverse((r) => !r)}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShape(shape === 'rect' ? 'square' : 'rect')}
        >
          {shape === 'square' ? (
            <RectangleHorizontal className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          {group.label && <h4 className="font-semibold">{group.label}</h4>}
          <div
            className={`grid gap-4 ${
              shape === 'square'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {group.items.map((c) => (
              <Card
                key={c.id}
                onClick={() => onSelectConcern(c)}
                className={`cursor-pointer ${shape === 'square' ? 'aspect-square flex flex-col' : ''}`}
              >
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-muted-foreground">{c.date}</div>
                  <span className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {c.diagnosis}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      </div>
  )
}
