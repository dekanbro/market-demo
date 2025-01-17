import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from '@/components/theme-provider'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { Providers } from './components/Providers'
import { ConnectButton } from './components/ConnectButton'

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>
            <header className="bg-background shadow-sm">
              <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-primary mb-4 sm:mb-0">Agent Market</Link>
                <nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <ul className="flex space-x-4">
                    <li><Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link></li>
                    <li><Link href="#" className="text-foreground hover:text-primary transition-colors">Categories</Link></li>
                    <li><Link href="#" className="text-foreground hover:text-primary transition-colors">About</Link></li>
                  </ul>
                  <div className="flex items-center gap-2">
                    <ConnectButton />
                    <DarkModeToggle />
                  </div>
                </nav>
              </div>
            </header>
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

