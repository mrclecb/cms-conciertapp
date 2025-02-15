'use client'
 
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import NProgress from 'nprogress'
 
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    NProgress.configure({ showSpinner: false })
  }, [])
 
  useEffect(() => {
    NProgress.start()
    
    // Simular un tiempo mínimo de carga para que la transición se vea suave
    const timer = setTimeout(() => {
      NProgress.done()
    }, 250)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])
 
  return null
}