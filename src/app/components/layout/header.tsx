import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '../shared/theme-toggle'

const Header = () => {
  return (
    <header className="w-full shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className=" p-1 shadow-lg">
            <Image
              src="/api/media/file/icon-app.png"
              alt="Conciertapp"
              width={32}
              height={32}
              className="transition-transform hover:scale-110"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-500 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
            Conciertapp
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header