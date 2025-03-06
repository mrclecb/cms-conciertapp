'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { X, Search, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'
import { useTheme } from '../shared/theme-provider'

interface DesktopFiltersProps {
  tags: any[]
  searchParams: any
  updateFilters: (params: Record<string, string>) => void
  handleQuickDateFilter: (filter: string) => void
  clearAllFilters: () => void
  date?: DateRange
  setDate: (date: DateRange | undefined) => void
  activeQuickFilter: string | null
}

export function DesktopFilters({
  tags,
  searchParams,
  updateFilters,
  handleQuickDateFilter,
  clearAllFilters,
  date,
  setDate,
  activeQuickFilter
}: DesktopFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [calendarOpen, setCalendarOpen] = useState(false)

  const selectedTags = searchParams.get('tag')?.split(',').filter(Boolean) || []
  const hasDateFilter = searchParams.get('dateFrom') && searchParams.get('dateTo')
  const hasSearch = searchParams.get('search')
  const hasActiveFilters = selectedTags.length > 0 || hasDateFilter || hasSearch
  const { theme } = useTheme();

  const QuickDateFilters = () => (
    <div className="flex gap-2">
      <Button
        variant={activeQuickFilter === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleQuickDateFilter('today')}
        className={activeQuickFilter === 'today' ? 'bg-black text-white' : 'hover:bg-gray-300 cursor-pointer'}
      >
        Hoy
      </Button>
      <Button
        variant={activeQuickFilter === 'tomorrow' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleQuickDateFilter('tomorrow')}
        className={activeQuickFilter === 'tomorrow' ? 'bg-black text-white' : 'hover:bg-gray-300 cursor-pointer'}

      >
        Mañana
      </Button>
      <Button
        variant={activeQuickFilter === 'thisWeek' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleQuickDateFilter('thisWeek')}
        className={activeQuickFilter === 'thisWeek' ? 'bg-black text-white' : 'hover:bg-gray-300 cursor-pointer'}

      >
        Esta semana
      </Button>
      <Button
        variant={activeQuickFilter === 'thisMonth' ? 'default' : 'outline'}
        className={activeQuickFilter === 'thisMonth' ? 'bg-black text-white' : 'hover:bg-gray-300 cursor-pointer'}
        size="sm"
        onClick={() => handleQuickDateFilter('thisMonth')}
      >
        Este mes
      </Button>
    </div>
  )

  const ActiveFilters = () => {
    if (!hasActiveFilters) return null

    return (
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm text-gray-500">Filtros activos:</span>
        <div className="flex flex-wrap gap-2">
          {hasSearch && (
            <Badge variant="secondary" className='font-normal'>
              Búsqueda: {searchParams.get('search')}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilters({ search: '' })}
              />
            </Badge>
          )}
          {selectedTags.map((tagId: string) => {
            const tag = tags.find(t => t.id === tagId)
            if (!tag) return null
            return (
              <Badge key={tagId} variant="secondary" className='font-normal'>
                {tag.name}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => {
                    const newTags = selectedTags.filter((id:string) => id !== tagId)
                    updateFilters({ tag: newTags.join(',') })
                  }}
                />
              </Badge>
            )
          })}
          {hasDateFilter && (
            <Badge variant="secondary" className='font-normal'>
              {format(new Date(searchParams.get('dateFrom')!), 'P', { locale: es })} -{' '}
              {format(new Date(searchParams.get('dateTo')!), 'P', { locale: es })}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilters({ dateFrom: '', dateTo: '' })}
              />
            </Badge>
          )}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-6 hover:bg-gray-300 cursor-pointer"
            >
              Limpiar todos
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg  pb-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateFilters({ search: searchTerm })
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Buscar conciertos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm" className='hover:bg-gray-300 cursor-pointer'>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </div>
        
        <Select
          defaultValue={searchParams.get('sort') || 'startDate'}
          onValueChange={(value) => updateFilters({ sort: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue className='hover:bg-gray-300 cursor-pointer' placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
            <SelectItem value="startDate">Más próximos</SelectItem>
            <SelectItem value="-startDate">Más lejanos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <QuickDateFilters />
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'ml-auto',
                  'hover:bg-gray-300 cursor-pointer',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'P', { locale: es })} -{' '}
                      {format(date.to, 'P', { locale: es })}
                    </>
                  ) : (
                    format(date.from, 'P', { locale: es })
                  )
                ) : (
                  'Seleccionar fechas'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={theme === 'dark' ? 'bg-gray-900 w-auto p-0' : 'bg-white w-auto p-0'} align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  if (newDate?.from) {
                    updateFilters({
                      dateFrom: newDate.from.toISOString(),
                      dateTo: newDate.to ? newDate.to.toISOString() : newDate.from.toISOString(),
                    })
                  } else {
                    updateFilters({ dateFrom: '', dateTo: '' })
                  }
                  setCalendarOpen(false)
                }}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id)
            return (
              <Button
                key={tag.id}
                variant={isSelected ? 'default' : 'outline'}
                className={isSelected ? 'bg-black text-white cursor-pointer' : 'hover:bg-gray-300 cursor-pointer'}
                size="sm"
                onClick={() => {
                  const currentTags = new Set(selectedTags)
                  if (isSelected) {
                    currentTags.delete(tag.id)
                  } else {
                    currentTags.add(tag.id)
                  }
                  updateFilters({
                    tag: Array.from(currentTags).join(','),
                  })
                }}
              >
                {tag.name}
              </Button>
            )
          })}
        </div>
      </div>
      <div>
        <ActiveFilters />
      </div>
    </div>
  )
}