# 📚 Study Planner - Student Task & Pomodoro Suite

> **Aplikasi Web Manajemen Tugas Kuliah, Kalender Bulanan Interaktif, & Timer Fokus Pomodoro berbasis Client-Side (Vanilla HTML5, CSS3, & JS).**

---

## 📌 Deskripsi & Latar Belakang
**Study Planner** adalah aplikasi web produktivitas yang dirancang khusus untuk mahasiswa dalam mengelola beban tugas akademik, jadwal mata kuliah, dan tenggat waktu (deadline) ujian / UTS. Aplikasi ini dibangun full *client-side* menggunakan teknologi web standar tanpa bergantung pada server backend, memanfaatkan fitur `localStorage` browser untuk penyimpanan data secara lokal dan permanen.

---

## 🚀 Fitur Utama & Fungsionalitas
1. **Target Uts Countdown Widget**
   - Widget *countdown* interaktif di beranda untuk memantau sisa hari menuju jadwal ujian/UTS.
   - Menggunakan *Custom Modal Overlay* untuk mengubah tanggal target ujian secara dinamis.
2. **Manajemen Tugas Kuliah (Task Hub)**
   - Input tugas dengan atribut nama, mata kuliah, prioritas (*Santai, Biasa, Mendesak*), dan tanggal deadline.
   - Fitur unggah lampiran file (*PDF, DOCX, Gambar, dll.*) yang dikonversi ke format *Base64*.
   - Filter tugas berdasarkan mata kuliah dan status penyelesaian (*Selesai / Belum*).
3. **Kalender Bulanan Interaktif (Calendar View)**
   - Tampilan visual kisi 7 kolom (Minggu - Sabtu) yang memetakan deadline tugas secara real-time.
   - Penanda titik (*status dot*) berwarna pada tanggal yang memiliki tugas aktif (titik merah untuk tugas *Mendesak*).
   - Navigasi bulan/tahun dan fitur klik tanggal untuk melihat detail tugas pada hari tersebut.
4. **Timer Fokus Pomodoro + Lofi Audio Synth**
   - Timer fokus belajar dengan tampilan durasi yang dapat diubah langsung (*editable content*).
   - Generator musik latar ambient (*Lofi Chords & Synth Pad*) menggunakan **Web Audio API** tanpa dependensi file audio eksternal.
5. **Notifikasi Smart Reminder & Web Push**
   - Sistem *Toast Notification* melayang di dalam web untuk pengingat otomatis tugas H-1 dan Hari H.
   - Terintegrasi dengan **Browser Notification API** untuk mengirim notifikasi push langsung ke perangkat pengguna.
6. **Portabilitas & Keamanan Data**
   - Ekspor dan Impor data cadangan berformat `.json`.
   - Fitur *Dark Mode* interaktif menggunakan Variabel CSS.
   - Proteksi tingkat dasar terhadap klik kanan (*context menu*) dan shortcut *Inspect Element*.

---

## 🛠️ Spesifikasi Teknis & Arsitektur Kode

### 1. Struktur HTML (`index.html`)
- Menggunakan **Tag Semantik HTML5** (`<header>`, `<nav>`, `<section>`, `<form>`, `<footer>`) untuk aksesibilitas dan struktur dokumen yang bersih.
- Komponen *Modal Custom* overlay untuk interaksi pengguna yang elegan (menggantikan alert kaku browser).

### 2. Desain & Styling CSS (`CSS/style.css`)
- **CSS Grid System**: Digunakan pada tata letak `.calendar-grid` (`repeat(7, 1fr)`) dan `.task-container`.
- **Flexbox**: Digunakan untuk navigasi header, baris form, dan kartu tugas.
- **CSS Variables (`:root`)**: Manajemen variabel warna terpusat yang memudahkan pengalihan mode terang dan gelap (`.dark-mode`).
- **Responsive Web Design**: Menggunakan `@media (max-width: 768px)` untuk penyesuaian otomatis pada layar smartphone.

### 3. Logika JavaScript (`JS/script.js`)
- **LocalStorage & JSON Parsing**: Menggunakan `JSON.stringify()` saat menyimpan array objek tugas dan `JSON.parse()` saat membaca kembali data dari browser.
- **Dynamic DOM Manipulation**: Pembuatan dan penghapusan elemen list serta kotak kalender secara dinamis.
- **JavaScript Date Object**: Kalkulasi tanggal hari ini, selisih hari deadline, dan penentuan jumlah hari dalam bulan menggunakan `new Date(year, month + 1, 0).getDate()`.
- **FileReader API**: Konversi file lampiran lokal pengguna menjadi string `DataURL` agar tersimpan secara efisien.

--

## 🌐 Live Demo & Deployment
Aplikasi ini di-deploy secara permanen menggunakan **GitHub Pages** dan dapat diakses publik melalui link berikut:

🔗 **Live Web**: [https://rafniz.github.io/study-planner/](https://rafniz.github.io/study-planner/)