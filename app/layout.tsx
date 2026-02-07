import type { Metadata } from 'next'
import './globals.css' // Chỉ cần dòng này là đủ

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
      <body className="bg-[#FDFCF0]">{children}</body>
    </html>
  )
}