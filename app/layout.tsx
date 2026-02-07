import type { Metadata } from 'next'
import { Inter, Mali } from 'next/font/google' // Import font Mali
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const mali = Mali({ 
  weight: ['400', '500', '600', '700'], 
  subsets: ['vietnamese'],
  variable: '--font-hand' // 👈 QUAN TRỌNG: Tên biến phải là --font-hand
})

export const metadata: Metadata = {
  title: 'Lưu Bút Trại Xuân 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      {/* 👇 Phải nạp biến mali.variable vào body thì cả web mới hiểu */}
      <body className={`${inter.variable} ${mali.variable} font-sans bg-[#FDFCF0]`}>
        {children}
      </body>
    </html>
  )
}