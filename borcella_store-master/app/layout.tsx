import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Drape & Dime",
  description: "Premium Fashion Store",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
} 