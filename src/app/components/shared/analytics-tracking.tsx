'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface Props {
  GA_MEASUREMENT_ID: string;
}

export default function AnalyticsTracking({ GA_MEASUREMENT_ID }: Props): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return null
}