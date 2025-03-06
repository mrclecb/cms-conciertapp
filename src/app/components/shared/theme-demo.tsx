"use client"

import { useTheme } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

export function ThemeDemo() {
  const { theme } = useTheme();
  
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 bg-white dark:bg-gray-900 shadow-md transition-all duration-500">
      <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-amber-500 to-red-500 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
        Demostración del Tema: {theme === 'dark' ? 'Oscuro 🌙' : 'Claro ☀️'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200">Este panel muestra cómo se ven los diferentes elementos con el tema actual.</p>
        </div>
        
        <div className="bg-white dark:bg-slate-950 p-3 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200">Los colores y contrastes cambian automáticamente según el tema.</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 p-2 bg-amber-50 dark:bg-indigo-900/30 rounded">
        <span className="text-amber-700 dark:text-indigo-300 text-sm">
          El tema actual es <strong>{theme === 'dark' ? 'Oscuro' : 'Claro'}</strong>
        </span>
        <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-indigo-400 animate-pulse' : 'bg-amber-400'}`}></div>
      </div>
    </div>
  );
} 