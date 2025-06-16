import { useState } from 'react'
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
  const [reverse, setReverse] = useState(false)
  const [shape, setShape] = useState<'rect' | 'square'>('rect')
  const [concerns, setConcerns] = useState<Concern[]>(initialConcerns)

  const sorted = [...concerns].sort((a, b) => {
    if (layout === 'latest') {
      return b.id - a.id
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  if (reverse) {
    sorted.reverse()
  }

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
      <div
        className={`grid gap-4 ${
          shape === 'square'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {sorted.map((c) => (
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
  )
}
