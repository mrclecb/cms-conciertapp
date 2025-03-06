"use client"

import { useEffect } from "react"
import { useTheme } from "./theme-provider"

// Este componente inyecta estilos con !important para forzar el tema
export function ThemeStyles() {
  const { theme } = useTheme()
  
  useEffect(() => {
    // Crear elemento de estilo
    const styleEl = document.createElement("style")
    styleEl.id = "theme-override-styles"
    
    // Definir estilos con !important para mayor contraste
    const styles = `
      /* Estilos para forzar contraste en modo oscuro */
      .dark .card {
        background-color: #1e1e1e !important;
        border-color: #333 !important;
        color: white !important;
      }
      
      .dark body {
        background-color: #121212 !important;
        color: white !important;
      }
      
      .dark .bg-white {
        background-color: #1e1e1e !important;
      }
      
      .dark .text-black {
        color: white !important;
      }

      /* Estilos para forzar contraste en modo claro */
      .light .card {
        background-color: white !important;
        border-color: #e5e7eb !important;
        color: black !important;
      }
      
      .light body {
        background-color: white !important;
        color: black !important;
      }
      
      .light .bg-gray-900 {
        background-color: white !important;
      }
      
      .light .text-white {
        color: black !important;
      }
    `
    
    styleEl.textContent = styles
    
    // Añadir al head
    document.head.appendChild(styleEl)
    
    // Limpiar al desmontar
    return () => {
      const existingStyle = document.getElementById("theme-override-styles")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [theme])
  
  return null
} 