# 📚 Study Planner - Task & Pomodoro Manager

> Minimalist & production-ready web application built for **UTS Pemrograman Web** — D4 Manajemen Informatika, Universitas Negeri Surabaya (UNESA).

---

## 🚀 Live Demo & Deployment
* **GitHub Pages:** `https://username-kamu.github.io/study-planner/` *(Replace `username-kamu` with your GitHub account)*

---

## 🛠️ Software Requirements Specification (SRS) & Architecture

### 1. Project Overview
**Study Planner** adalah *single-page application* (SPA) lightweight yang dirancang untuk mengelola *task list* perkuliahan dan menjaga *deep work session* mahasiswa. Dikembangkan murni menggunakan **Pure Vanilla JS (ES6+)**, **HTML5**, dan **CSS3** tanpa dependensi *framework* atau *library* eksternal (zero dependency).

### 2. Core Features & Technical Implementation
* **Task CRUD & Complete Task Toggle (DOM Manipulation):**
  * Full CRUD functionality (Create, Read, Update, Delete) untuk manajemen tugas secara dinamis.
  * **Fitur Mark as Complete**: Tombol *toggle* status selesai yang mengubah tampilan *card* menjadi redup (*muted*), mencoret teks tugas (*strikethrough*), dan memperbarui badge status menjadi `✅ Selesai`.
  * Conditional rendering untuk *priority badges* (`Santai`, `Biasa`, `Mendesak`) serta *reactive state update* pada komponen *Hero Preview*.
* **Customizable Pomodoro Engine & Web Audio API:**
  * Interval timer berbasis timestamp `Date.now()` untuk mencegah *timer drift* ketika tab di-background oleh browser.
  * **Inline Editable Timer**: Menggunakan atribut `contenteditable` pada DOM element sehingga user bisa mengkustomisasi durasi timer secara langsung.
  * **Synthesized Audio Alarm**: Menghasilkan sinyal audio *beep* frekuensi ganda secara programmatic via `Web Audio API` (OscillatorNode & GainNode) tanpa perlu aset `.mp3` eksternal.
* **Persistent Dark Mode (Local Storage):**
  * Dynamic theme switcher menggunakan CSS Custom Properties (Variables) dengan *state persistence* via `localStorage`.
* **Client-Side Security & UI Protection:**
  * Mencegah aksi *default context menu* (`contextmenu`) dan memblokir keyboard shortcuts devtools/copy (`F12`, `Ctrl+U`, `Cmd+Option+I`) via event listeners.
* **Fully Responsive Layout:**
  * Dibangun dengan arsitektur CSS Grid dan Flexbox untuk performa *cross-device rendering* yang optimal dari mobile hingga desktop.

---

## 📂 Repository Structure

```text
study-planner/
├── css/
│   └── style.css    # Design system, CSS variables, & dark mode styling
├── js/
│   └── script.js    # Core logic, DOM handlers, & Web Audio API synthesis
├── index.html       # Markup semantik, Inline SVG asset, & DOM entry point
└── README.md        # Dokumentasi proyek & spesifikasi SRS