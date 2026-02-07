# 🏕️ Digital Guestbook - Trại Xuân 2026 (Spring Camp 2026)

A real-time digital guestbook built for the **Information Technology Alliance (Liên Quân Tin)** at Spring Camp 2026. This application allows students to leave digital memories, wishes, and notes in a nostalgic, interactive "sticky note" interface.

🚀 **Live Demo:** https://trai-xuan-2026.vercel.app/

---

## ✨ Key Features

* **⚡ Real-time Updates:** Powered by **Supabase Realtime**, new messages appear instantly on all connected devices without refreshing the page.
* **🎨 Nostalgic UI/UX:** Designed with a "School Memory" vibe using:
    * **Handwriting Fonts:** Integrated *Mali* and *Merriweather* via Google Fonts.
    * **Paper Textures:** Custom CSS patterns mimicking notebook paper.
    * **Randomized Design:** Note cards have random colors, rotation angles, and tape effects for a natural look.
* **📱 Responsive Masonry Layout:** A Pinterest-style layout that adapts perfectly from mobile screens (1 column) to desktops (3 columns).
* **🚀 Optimized Performance:** Built with **Next.js 14 App Router** for server-side rendering and fast initial load.

---

## 🛠️ Tech Stack

This project uses modern web technologies focusing on performance and developer experience:

* **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (with custom configuration for fonts & animations)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 📸 Screenshots

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7288e976-5a2a-4756-ae2a-d9e670cf4d93" />

---

## 💡 Technical Highlights (What I Learned)

During the development of this project, I tackled several technical challenges:

1.  **Handling Real-time Data Subscription:**
    Implemented `useEffect` hooks to subscribe to Supabase's `postgres_changes` events, ensuring the UI state stays synchronized with the database in milliseconds.

2.  **Custom Tailwind Configuration:**
    Extended the default Tailwind theme to support custom font variables (`var(--font-hand)`) and created utility classes for the "glassmorphism" and paper texture effects.

3.  **Dynamic UI Generation:**
    Applied mathematical logic to generate random rotation angles (`-2deg` to `2deg`) and background colors for each note card while maintaining visual consistency.

---

