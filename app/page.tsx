'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Hash, User, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

// Định nghĩa kiểu dữ liệu
type GuestbookEntry = {
  id: string
  created_at: string
  name: string
  message: string
  class_name: string
  bg_color: string
}

const COLORS = [
  'bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-orange-100'
]

export default function Home() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    const fetchEntries = async () => {
      const { data } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setEntries(data)
    }

    fetchEntries()

    // 2. Kích hoạt Realtime (Lắng nghe thay đổi)
    const channel = supabase
      .channel('realtime-guestbook')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
        setEntries((current) => [payload.new as GuestbookEntry, ...current])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 3. Xử lý gửi tin nhắn
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const message = formData.get('message') as string
    const class_name = formData.get('class_name') as string
    
    // Chọn màu ngẫu nhiên
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]

    if (!name || !message) return

    await supabase.from('guestbook').insert([
      { name, message, class_name, bg_color: randomColor }
    ])

    formRef.current?.reset()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center uppercase tracking-wider">
          🏕️ Lưu Bút Trại Xuân 2026
        </h1>
        <p className="text-center text-blue-100 text-sm mt-1">Liên Quân Tin - Kỷ niệm còn mãi</p>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Form nhập liệu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  name="name" 
                  placeholder="Tên bạn..." 
                  className="w-full pl-9 p-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm text-black" 
                  required
                />
              </div>
              <div className="relative w-1/3">
                <Hash className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input 
                  name="class_name" 
                  placeholder="Lớp..." 
                  className="w-full pl-9 p-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm text-black" 
                />
              </div>
            </div>
            
            <div className="relative">
              <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <textarea 
                name="message" 
                placeholder="Để lại lời nhắn nhủ yêu thương..." 
                rows={3}
                className="w-full pl-9 p-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm text-black resize-none"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Đang gửi...' : (
                <>
                  <Send className="w-4 h-4" /> Gửi Lưu Bút
                </>
              )}
            </button>
          </form>
        </div>

        {/* Danh sách lưu bút */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-500 text-sm uppercase ml-1">
            Mới nhất ({entries.length})
          </h2>
          
          {entries.length === 0 ? (
             <p className="text-center text-gray-400 py-10">Chưa có ai viết gì cả. Mở hàng đi!</p>
          ) : (
            entries.map((item) => (
              <div key={item.id} className={`${item.bg_color} p-4 rounded-2xl shadow-sm border border-black/5 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  "{item.message}"
                </p>
                <div className="mt-3 flex justify-between items-center border-t border-black/5 pt-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                    {item.class_name && <span className="text-xs text-gray-500">{item.class_name}</span>}
                  </div>
                  <span className="text-[10px] text-gray-400 bg-white/50 px-2 py-1 rounded-full">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}