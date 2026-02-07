import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // 👈 DÒNG QUAN TRỌNG NHẤT: Nạp CSS vào web

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lưu Bút Trại Xuân 2026',
  description: 'Kỷ niệm Liên Quân Tin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}