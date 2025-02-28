import React from 'react'
import '../globals.css'
import { Poppins } from 'next/font/google'
import GoogleAnalytics from '../components/shared/google-analytics'
import Header from '../components/layout/header'

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
    <html lang="es-CL" className={oswald.className}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <meta name='google-adsense-account' content='ca-pub-7692922132309887'/>
      <body>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}  
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
