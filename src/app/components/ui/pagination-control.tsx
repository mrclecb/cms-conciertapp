'use client'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationControlsProps {
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function PaginationControls({
  totalPages,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `?${params.toString()}`
  }

  const renderPageNumbers = () => {
    const pages = []
    
    // Siempre mostrar primera página
    pages.push(
      <Button
        key={1}
        className={currentPage === 1 ? `bg-black text-white hidden sm:inline-flex` : `cursor-pointer hover:bg-gray-300 hidden sm:inline-flex`}
        variant={currentPage === 1 ? 'default' : 'outline'}
        size="sm"
        onClick={() => router.push(createPageURL(1))}
      >
        1
      </Button>
    )

    // Puntos suspensivos izquierdos si necesario
    if (currentPage > 3) {
      pages.push(
        <Button key="dots-1" variant="ghost" size="sm" className="cursor-default hover:bg-gray-300 hidden sm:inline-flex" disabled>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    }

    // Páginas alrededor de la actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(
        <Button
          key={i}
          className={currentPage === i ? `bg-black text-white` : `cursor-pointer hover:bg-gray-300`}
          variant={currentPage === i ? 'default' : 'outline'}
          size="sm"
          onClick={() => router.push(createPageURL(i))}
        >
          {i}
        </Button>
      )
    }

    // Puntos suspensivos derechos si necesario
    if (currentPage < totalPages - 2) {
      pages.push(
        <Button key="dots-2" variant="ghost" size="sm" className="cursor-default hidden sm:inline-flex" disabled>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    }

    // Siempre mostrar última página
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          className={currentPage === totalPages ? `bg-black text-white hidden sm:inline-flex` : `hover:bg-gray-300 cursor-pointer hidden sm:inline-flex`}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="sm"
          onClick={() => router.push(createPageURL(totalPages))}
        >
          {totalPages}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer hover:bg-gray-300"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={!hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Anterior</span>
      </Button>

      <div className="flex items-center gap-1 sm:gap-2">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer hover:bg-gray-300"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={!hasNextPage}
      >
        <span className="hidden sm:inline mr-1">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}