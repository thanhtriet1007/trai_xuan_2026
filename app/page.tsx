'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase' 
import { Send, PenTool, Sparkles, Pin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

type GuestbookEntry = {
  id: string
  created_at: string
  name: string
  message: string
  class_name: string
  rotation: number 
}


const PAPER_COLORS = [
  'bg-[#fff7d1] shadow-yellow-200/50',
  'bg-[#e2f0cb] shadow-green-200/50', 
  'bg-[#ffdee1] shadow-pink-200/50', 
  'bg-[#d4f0f0] shadow-cyan-200/50',   
  'bg-[#f0e6ff] shadow-purple-200/50', 
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
      
      if (data) {
       
        const dataWithRotation = data.map((item: any) => ({
          ...item,
          rotation: Math.random() * 4 - 2 
        }))
        setEntries(dataWithRotation)
      }
    }
    fetchEntries()

    const channel = supabase
      .channel('realtime-guestbook')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
        const newMsg = {
            ...payload.new,
            rotation: Math.random() * 4 - 2 
        } as GuestbookEntry
        setEntries((prev) => [newMsg, ...prev])
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

    if (!name || !message) return

    await supabase.from('guestbook').insert([{ name, message, class_name }])
    formRef.current?.reset()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#FDFCF0] text-[#4a4a4a] pb-20 overflow-x-hidden">
      {}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}>
      </div>

      {}
      <div className="relative pt-16 pb-12 text-center z-10">
        <div className="inline-block relative">
             <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#2c3e50] tracking-tight relative z-10">
                Lưu Bút Trại Xuân
             </h1>
             {}
             <svg className="absolute -bottom-2 w-full h-3 text-orange-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
             </svg>
        </div>
        <p className="mt-4 font-hand text-xl md:text-2xl text-[#7f8c8d]">
          "Vietnam mới Tin Tin Tin Tin..."
        </p>
        <p className="mt-4 font-hand text-xl md:text-2xl text-[#7f8c8d]">
          "Trie yêu Cà Rốt nhất nhé"
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        {}
        <div className="bg-white max-w-2xl mx-auto p-1 rounded-sm shadow-xl transform rotate-1 border border-gray-200 mb-16 relative">
          {}
          <div className="absolute -top-3 -right-3 bg-red-100 text-red-800 p-2 rounded shadow-sm transform rotate-12 border border-red-200">
             <span className="font-serif text-xs font-bold">2026</span>
          </div>

          <div className="border-2 border-dashed border-gray-300 p-6 md:p-8 bg-white">
            <h3 className="font-hand text-2xl mb-4 text-[#2c3e50] flex items-center gap-2">
              <PenTool size={20} /> Viết đôi dòng kỷ niệm...
            </h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 font-serif">
              <div className="flex gap-4">
                <input 
                  name="name" 
                  placeholder="Tên cậu là..." 
                  className="flex-1 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none py-2 px-1 transition-colors placeholder:font-hand placeholder:text-lg"
                  required
                />
                <input 
                  name="class_name" 
                  placeholder="Lớp..." 
                  className="w-1/3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none py-2 px-1 transition-colors placeholder:font-hand placeholder:text-lg"
                />
              </div>
              
              <div className="relative">
                <textarea 
                  name="message" 
                  placeholder="Nhắn nhủ tới Liên Quân Tin..." 
                  rows={3}
                  className="w-full bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-[#fafafa] border border-gray-200 rounded p-4 outline-none focus:ring-2 focus:ring-orange-200 resize-none font-hand text-xl leading-8"
                  required
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-white font-bold py-3 rounded shadow-lg transition-all flex items-center justify-center gap-2 font-sans uppercase tracking-wider text-sm"
              >
                {loading ? 'Đang dán tem...' : <><Send size={16} /> Gửi Lưu Bút</>}
              </button>
            </form>
          </div>
        </div>

        {}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-8 px-2">
          {entries.map((item, index) => (
            <div 
              key={item.id} 
              className={`break-inside-avoid relative p-6 shadow-md transition-transform hover:scale-105 duration-300 ${PAPER_COLORS[index % PAPER_COLORS.length]}`}
              style={{ transform: `rotate(${item.rotation}deg)` }} 
            >
              {}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm shadow-sm rotate-1 skew-x-12 opacity-80"></div>

              {}
              {index % 3 === 0 && (
                 <Pin className="absolute -top-4 -right-2 text-red-400 drop-shadow-md transform -rotate-12" size={24} fill="currentColor" />
              )}

              <p className="font-hand text-2xl text-[#2c3e50] leading-relaxed mb-4 whitespace-pre-wrap">
                {item.message}
              </p>
              
              <div className="flex justify-between items-end border-t border-black/10 pt-3 mt-2">
                <div>
                    <div className="font-serif font-bold text-[#2c3e50] text-sm">
                        {item.name}
                    </div>
                    {item.class_name && (
                        <div className="font-sans text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">
                            {item.class_name}
                        </div>
                    )}
                </div>
                <span className="font-hand text-sm text-gray-500">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
            <div className="text-center py-20 opacity-40">
                <Sparkles className="mx-auto mb-4 text-gray-400" size={48}/>
                <p className="font-hand text-2xl">Trang lưu bút đang chờ dòng mực đầu tiên...</p>
            </div>
        )}
      </div>
    </main>
  )
}