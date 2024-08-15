import 'react-perfect-scrollbar/dist/css/styles.css'
import '@/app/globals.css'
import { AuthProvider } from '@/context/useAuth'
import { ThemeProvider } from '@/utils/theme/theme-provider'
import React from 'react'

export const metadata = {
  title: 'Lexxi UI',
  description: 'Lexxi UI application'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className='flex min-h-screen flex-auto flex-col'>
        <ThemeProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout