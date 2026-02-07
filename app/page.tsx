'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Hash, User, Code2, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

type GuestbookEntry = {
  id: string
  created_at: string
  name: string
  message: string
  class_name: string
  bg_color: string // Chúng ta sẽ dùng gradient thay vì màu đơn
}

// Bộ màu Gradient hiện đại cho các thẻ
const GRADIENTS = [
  'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-200',
  'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-200',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-200',
  'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-200',
  'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-200',
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
        // Ép kiểu để không lỗi
        const newEntry = payload.new as any 
        setEntries((prev) => [newEntry as GuestbookEntry, ...prev])
      })
      .subscribe()

    // --- ĐOẠN SỬA LỖI Ở ĐÂY ---
    return () => {
      supabase.removeChannel(channel) // Thêm dấu ngoặc nhọn để không return Promise
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const message = formData.get('message') as string
    const class_name = formData.get('class_name') as string
    
    // Chọn màu ngẫu nhiên
    const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]

    if (!name || !message) return

    await supabase.from('guestbook').insert([
      { name, message, class_name, bg_color: randomGradient }
    ])
    formRef.current?.reset()
    setLoading(false)
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 font-sans selection:bg-cyan-500/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />
      
      {/* Lights Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Code2 size={14} /> Liên Quân Tin • Trại Xuân 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-slate-400 drop-shadow-2xl">
            Lưu Bút Số
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Gửi những dòng code cảm xúc vào database kỷ niệm của chúng ta. <br/> 
            <span className="text-cyan-400 font-mono text-sm">git commit -m "memories"</span>
          </p>
        </div>

        {/* Input Form - Glassmorphism */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl mb-16 max-w-2xl mx-auto border-t border-white/10">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative">
                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                <input 
                  name="name" 
                  placeholder="Tên của bạn (VD: Huy Dev)" 
                  className="w-full bg-slate-900/50 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="group relative">
                <Hash className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
                <input 
                  name="class_name" 
                  placeholder="Lớp (VD: 12 Tin)" 
                  className="w-full bg-slate-900/50 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            
            <div className="group relative">
              <textarea 
                name="message" 
                placeholder="Nhập nội dung lưu bút... (Hỗ trợ Markdown tinh thần)" 
                rows={3}
                className="w-full bg-slate-900/50 text-white p-4 rounded-xl border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Đang đẩy lên Cloud...</span>
              ) : (
                <>
                  <Send size={18} /> Gửi Lưu Bút <Sparkles size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Masonry Grid Layout cho Note */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-20">
          {entries.map((item) => (
            <div 
              key={item.id} 
              className={`break-inside-avoid bg-gradient-to-br ${item.bg_color || 'from-slate-800 to-slate-900 border-slate-700'} border p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300 relative group`}
            >
              {/* Decorative Quote Icon */}
              <div className="absolute -top-3 -left-3 bg-slate-950 p-2 rounded-full border border-slate-800">
                <span className="text-2xl">❝</span>
              </div>

              <p className="text-white/90 leading-relaxed font-medium mb-4 whitespace-pre-wrap">
                {item.message}
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center text-xs font-bold ring-1 ring-white/20">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white/90">{item.name}</h4>
                    {item.class_name && (
                      <span className="text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                        {item.class_name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-white/40 font-mono">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <p className="text-slate-500">Database trống rỗng...</p>
                <p className="text-slate-600 text-sm">Hãy là người đầu tiên commit!</p>
            </div>
        )}
      </div>
    </main>
  )
}