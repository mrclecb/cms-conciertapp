'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { startOfToday, endOfToday, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { MobileFilters } from './concert-mobile-filters'
import { DesktopFilters } from './concert-desktop-filters'

interface ConcertFiltersProps {
  tags: Array<{
    id: string
    name: string
  }>
}

export function ConcertFilters({ tags }: ConcertFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Estados compartidos
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const from = searchParams.get('dateFrom')
    const to = searchParams.get('dateTo')
    if (from && to) {
      return {
        from: new Date(from),
        to: new Date(to),
      }
    }
    return undefined
  })
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)

  // Funciones compartidas
  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Si estamos actualizando los tags, eliminar el parámetro page
    if ('tag' in newParams || 'dateFrom' in newParams) {
      params.delete('page')
    }

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/?${params.toString()}`)
  }

  const handleQuickDateFilter = (filter: string) => {
    let dateFrom: Date
    let dateTo: Date
    const today = new Date()

    switch (filter) {
      case 'today':
        dateFrom = startOfToday()
        dateTo = endOfToday()
        break
      case 'tomorrow':
        dateFrom = startOfToday()
        dateFrom = addDays(dateFrom, 1)
        dateTo = endOfToday()
        dateTo = addDays(dateTo, 1)
        break
      case 'thisWeek':
        dateFrom = startOfWeek(today, { locale: es })
        dateTo = endOfWeek(today, { locale: es })
        break
      case 'thisMonth':
        dateFrom = startOfMonth(today)
        dateTo = endOfMonth(today)
        break
      default:
        return
    }

    setDate({ from: dateFrom, to: dateTo })
    setActiveQuickFilter(filter)
    updateFilters({
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    })
  }

  const clearAllFilters = () => {
    setDate(undefined)
    setActiveQuickFilter(null)
    router.push('/')
  }

  // Props compartidos para ambos componentes
  const sharedProps = {
    tags,
    searchParams,
    updateFilters,
    handleQuickDateFilter,
    clearAllFilters,
    date,
    setDate,
    activeQuickFilter,
  }

  return (
    <>
      {/* Versión móvil */}
      <div className="md:hidden">
        <MobileFilters {...sharedProps} />
      </div>

      {/* Versión desktop */}
      <div className="hidden md:block">
        <DesktopFilters {...sharedProps} />
      </div>
    </>
  )
}

// types.ts
export interface SharedFiltersProps {
  tags: Array<{
    id: string
    name: string
  }>
  searchParams: any
  updateFilters: (params: Record<string, string>) => void
  handleQuickDateFilter: (filter: string) => void
  clearAllFilters: () => void
  date?: DateRange
  setDate: (date: DateRange | undefined) => void
  activeQuickFilter: string | null
}