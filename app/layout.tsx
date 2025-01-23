import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { DarkModeToggle } from '@/components/dark-mode-toggle'

import { ConnectButton } from './components/ConnectButton'
import Image from 'next/image'

import { Providers } from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Agent Marketplace',
  description: 'A agent marketplace mockup with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <div className="relative w-full h-[200px] md:h-[200px]">
              <Image
                src="/marketheader.png"
                alt="Agent Market Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
              <header className="absolute top-0 w-full">
                <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
                  <Link href="/" className="text-2xl font-bold text-primary mb-4 sm:mb-0 drop-shadow-md">
                    Agent Market
                  </Link>
                  <nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-background/95 backdrop-blur-sm px-4 py-2 w-full sm:w-auto sm:rounded-full">
                    <ul className="flex space-x-4">
                      <li>
                        <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/create" className="text-primary hover:text-primary/80 transition-colors">
                          Create
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
                          About
                        </Link>
                      </li>
                    </ul>
                    <div className="flex items-center gap-2">
                      <ConnectButton />
                      <DarkModeToggle />
                    </div>
                  </nav>
                </div>
              </header>
            </div>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-muted py-6">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>&copy; 2025 Agent Market. All rights reserved.</p>
              </div>
            </footer>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

