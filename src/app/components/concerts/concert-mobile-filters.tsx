'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/app/components/shared/theme-provider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, SlidersHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

interface MobileFiltersProps {
  tags: any[]
  searchParams: any
  updateFilters: (params: Record<string, string>) => void
  handleQuickDateFilter: (filter: string) => void
  clearAllFilters: () => void
  date?: DateRange
  setDate: (date: DateRange | undefined) => void
  activeQuickFilter: string | null
}

export function MobileFilters({
  tags,
  searchParams,
  updateFilters,
  handleQuickDateFilter,
  clearAllFilters,
  activeQuickFilter
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const { theme } = useTheme()

  // Contadores para el indicador de filtros activos
  const selectedTags = searchParams.get('tag')?.split(',').filter(Boolean) || []
  const hasDateFilter = searchParams.get('dateFrom') && searchParams.get('dateTo')
  const hasSearch = searchParams.get('search')
  const activeFiltersCount = (selectedTags.length > 0 ? 1 : 0) + 
                            (hasDateFilter ? 1 : 0) + 
                            (hasSearch ? 1 : 0)

  const QuickDateFilters = () => (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      <Button
        variant={activeQuickFilter === 'today' ? 'default' : 'outline'}
        size="sm"
        className={activeQuickFilter === 'today' ? 'bg-black text-white shrink-0' : 'shrink-0'}
        onClick={() => handleQuickDateFilter('today')}
      >
        Hoy
      </Button>
      <Button
        variant={activeQuickFilter === 'tomorrow' ? 'default' : 'outline'}
        size="sm"
        className={activeQuickFilter === 'tomorrow' ? 'bg-black text-white shrink-0' : 'shrink-0'}
        onClick={() => handleQuickDateFilter('tomorrow')}
      >
        Mañana
      </Button>
      <Button
        variant={activeQuickFilter === 'thisWeek' ? 'default' : 'outline'}
        className={activeQuickFilter === 'thisWeek' ? 'bg-black text-white shrink-0' : 'shrink-0'}
        size="sm"
        onClick={() => handleQuickDateFilter('thisWeek')}
      >
        Esta semana
      </Button>
      <Button
        variant={activeQuickFilter === 'thisMonth' ? 'default' : 'outline'}
        size="sm"
        className={activeQuickFilter  === 'thisMonth' ? 'bg-black text-white shrink-0' : 'shrink-0'}
        onClick={() => handleQuickDateFilter('thisMonth')}
      >
        Este mes
      </Button>
    </div>
  )

  const ActiveFilters = () => {
    if (!hasSearch && selectedTags.length === 0 && !hasDateFilter) return null

    return (
      <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4">
        {hasSearch && (
          <Badge variant="secondary" className="shrink-0 font-normal">
            {searchParams.get('search')}
            <X 
              className="h-3 w-3 ml-1" 
              onClick={() => updateFilters({ search: '' })}
            />
          </Badge>
        )}
        {selectedTags.map((tagId:string) => {
          const tag = tags.find(t => t.id === tagId)
          if (!tag) return null
          return (
            <Badge key={tagId} variant="secondary" className="shrink-0 font-normal">
              {tag.name}
              <X 
                className="h-3 w-3 ml-1" 
                onClick={() => {
                  const newTags = selectedTags.filter((id: string) => id !== tagId)
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 pb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters({ search: searchTerm })
              }
            }}
            className="h-9"
          />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative shrink-0" aria-label='Ver opciones de filtros'>
                <SlidersHorizontal className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className={`h-[75vh] ${theme ==='dark' ? 'bg-black' : 'bg-white'}`}>
              <SheetHeader className="pb-4">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ordenar por</h3>
                  <Select
                    defaultValue={searchParams.get('sort') || 'startDate'}
                    onValueChange={(value) => updateFilters({ sort: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className=''>
                      <SelectItem value="startDate">Más próximos</SelectItem>
                      <SelectItem value="-startDate">Más lejanos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Fechas</h3>
                  <QuickDateFilters />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id)
                      return (
                        <Button
                          key={tag.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={isSelected ? 'bg-black text-white' : ''}
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
              </div>

              <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      clearAllFilters()
                      setIsOpen(false)
                    }}
                    className="flex-1"
                  >
                    Limpiar filtros
                  </Button>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Ver resultados
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <ActiveFilters />
      </div>
    </div>
  )
}