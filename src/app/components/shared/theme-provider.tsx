"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "conciertapp-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)
  
  // Después del montaje inicial, intentamos leer el tema del localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(storageKey) as Theme
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Eliminar todas las clases relacionadas con el tema
    root.classList.remove("light", "dark")
    
    // Aplicar la clase del tema actual
    root.classList.add(theme)
    
    // Configurar variables CSS personalizadas para mayor contraste
    if (theme === "dark") {
      document.documentElement.style.setProperty('--background-color', '#121212')
      document.documentElement.style.setProperty('--text-color', '#ffffff')
      document.documentElement.style.setProperty('--accent-color', '#ffcc00')
      document.documentElement.style.setProperty('--card-bg', '#1e1e1e')
      document.documentElement.style.setProperty('--border-color', '#333')
    } else {
      document.documentElement.style.setProperty('--background-color', '#ffffff')
      document.documentElement.style.setProperty('--text-color', '#000000')
      document.documentElement.style.setProperty('--accent-color', '#3b82f6')
      document.documentElement.style.setProperty('--card-bg', '#f9fafb')
      document.documentElement.style.setProperty('--border-color', '#e5e7eb')
    }

    // Aplicar cambios CSS adicionales para forzar el contraste
    if (theme === "dark") {
      document.body.style.backgroundColor = "#121212"
      document.body.style.color = "#ffffff"
    } else {
      document.body.style.backgroundColor = "#ffffff"
      document.body.style.color = "#000000"
    }
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  // Antes de que el componente esté montado, ocultamos el contenido para evitar parpadeos
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
} 