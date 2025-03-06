import React from 'react'
import '../globals.css'
import '../styles.css'
import { Poppins } from 'next/font/google'
import GoogleAnalytics from '../components/shared/google-analytics'
import Header from '../components/layout/header'
import { ThemeProvider } from '../components/shared/theme-provider'

export const metadata = {
  description: 'Directorio de eventos musicales de Chile.',
  title: 'Conciertapp',
}

const oswald = Poppins({
  subsets: ['latin'],
  // Opcionalmente puedes especificar los weights que necesitas
  weight: ['400', '700'],
  // Opcionalmente variable para fuentes variables
  variable: '--font-oswald',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es-CL" suppressHydrationWarning className="light">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name='google-adsense-account' content='ca-pub-7692922132309887'/>
      </head>
      <body className={`${oswald.className} bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-500`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <ThemeProvider defaultTheme="light">
          <div className="min-h-screen flex flex-col transition-all duration-100">
            <Header />
            <main className="flex-grow relative">
              {children}
            </main>
            <footer className="py-6 px-4  text-center transition-all">
              <p className="text-gray-700 dark:text-gray-300">
                Conciertapp &copy; {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
