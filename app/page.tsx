'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase' 
import { Send, Hash, User, Sparkles, Tent } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

type GuestbookEntry = {
  id: string
  created_at: string
  name: string
  message: string
  class_name: string
  bg_color: string 
}

// Màu Pastel nhẹ nhàng cho background các thẻ note
const NOTE_COLORS = [
  'bg-orange-50 border-orange-200 text-orange-900',
  'bg-yellow-50 border-yellow-200 text-yellow-900',
  'bg-rose-50 border-rose-200 text-rose-900',
  'bg-blue-50 border-blue-200 text-blue-900',
  'bg-emerald-50 border-emerald-200 text-emerald-900',
]

export default function Home() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const fetchEntries = async () => {
      const { data } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setEntries(data)
    }
    fetchEntries()

    const channel = supabase
      .channel('realtime-guestbook')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
        const newMsg = payload.new as any
        setEntries((prev) => [newMsg as GuestbookEntry, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const message = formData.get('message') as string
    const class_name = formData.get('class_name') as string
    const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]

    if (!name || !message) return

    await supabase.from('guestbook').insert([
      { name, message, class_name, bg_color: randomColor }
    ])
    formRef.current?.reset()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans">
      {/* Header rực rỡ */}
      <div className="bg-gradient-to-r from-orange-400 to-rose-500 py-12 px-4 shadow-lg mb-10 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm font-bold mb-4 border border-white/30 shadow-sm">
              <Tent size={16} /> TRẠI XUÂN 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md tracking-tight">
              LƯU BÚT LIÊN QUÂN TIN
            </h1>
            <p className="text-orange-50 mt-2 font-medium">Gửi gắm kỷ niệm, lưu giữ thanh xuân</p>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        
        {/* Form nhập liệu kiểu Card nổi */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 mb-12 transform hover:-translate-y-1 transition-all duration-300">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <User className="absolute left-3 top-3 text-orange-300 w-5 h-5" />
                <input 
                  name="name" 
                  placeholder="Tên cậu là gì?" 
                  className="w-full bg-orange-50/50 pl-10 pr-4 py-3 rounded-xl border border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-orange-300/70"
                  required
                />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-orange-300 w-5 h-5" />
                <input 
                  name="class_name" 
                  placeholder="Lớp..." 
                  className="w-full bg-orange-50/50 pl-10 pr-4 py-3 rounded-xl border border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-orange-300/70"
                />
              </div>
            </div>
            
            <textarea 
              name="message" 
              placeholder="Viết vài dòng kỷ niệm vào đây nhé..." 
              rows={3}
              className="w-full bg-orange-50/50 p-4 rounded-xl border border-orange-100 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-orange-300/70 resize-none"
              required
            />

            <button 
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? 'Đang gửi...' : <><Send size={18} /> Gửi ngay</>}
            </button>
          </form>
        </div>

        {/* Danh sách Masonry Cards */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {entries.map((item) => (
            <div 
              key={item.id} 
              className={`break-inside-avoid ${item.bg_color || 'bg-white border-slate-100'} p-5 rounded-2xl shadow-sm hover:shadow-md border transform hover:-translate-y-1 transition-all duration-300 relative`}
            >
              {/* Ghim giấy note */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-12 bg-orange-200/50 rotate-3 rounded-sm backdrop-blur-sm z-10 opacity-50"></div>
              
              <p className="font-medium text-lg mb-4 mt-2 leading-relaxed opacity-90 font-handwriting">
                "{item.message}"
              </p>
              
              <div className="flex justify-between items-center pt-3 border-t border-black/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/50 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        {item.class_name && <span className="text-xs opacity-60 uppercase">{item.class_name}</span>}
                    </div>
                </div>
                <span className="text-[10px] opacity-50 font-mono">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {entries.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <Sparkles className="mx-auto mb-2 text-orange-300" size={40}/>
                <p className="text-slate-400">Trang giấy trắng chưa có mực...</p>
            </div>
        )}
      </div>
    </main>
  )
}