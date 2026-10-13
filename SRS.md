# 📄 Software Requirements Specification (SRS)
## **Study Planner & Student Productivity Suite**

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen Spesifikasi Kebutuhan Perangkat Lunak (*Software Requirements Specification* - SRS) ini disusun untuk memberikan gambaran komprehensif mengenai perancangan, arsitektur teknis, kebutuhan fungsional, dan kebutuhan non-fungsional dari aplikasi web **Study Planner**. Dokumen ini menjadi acuan utama dalam pengembangan, pengujian, serta evaluasi sistem.

### 1.2 Lingkup Proyek (Project Scope)
**Study Planner** adalah aplikasi web produktivitas *client-side* yang dirancang khusus bagi mahasiswa untuk mengelola beban tugas akademik, memantau tenggat waktu (*deadline*), mempersiapkan jadwal ujian (UTS/UAS), serta menjaga fokus belajar dengan teknik Pomodoro dan musik ambient.

Aplikasi ini beroperasi penuh di sisi klien (*client-side*) tanpa ketergantungan pada server backend eksternal, memanfaatkan penyimpanan lokal browser (`localStorage`), dan di-deploy secara publik menggunakan **GitHub Pages**.

### 1.3 Definisi & Singkatan
- **SRS**: *Software Requirements Specification* (Spesifikasi Kebutuhan Perangkat Lunak).
- **UI/UX**: *User Interface* / *User Experience*.
- **CRUD**: *Create, Read, Update, Delete* (Manajemen data dasar).
- **DOM**: *Document Object Model*.
- **JSON**: *JavaScript Object Notation* (Format data berbasis teks).
- **API**: *Application Programming Interface*.

---

## 2. Deskripsi Umum System

### 2.1 Perspektif Produk
Study Planner merupakan aplikasi web mandiri (*standalone client-side web application*) yang dibangun menggunakan teknologi standar **HTML5, CSS3, dan Vanilla JavaScript**. Aplikasi berjalan di dalam peramban web (*browser*) modern tanpa memerlukan proses instalasi atau konfigurasi database server terpisah.

### 2.2 Karakteristik Pengguna
- **Pengguna Utama**: Mahasiswa aktif yang membutuhkan sistem pencatatan tugas terstruktur, kalender interaktif, dan alat bantu fokus belajar.
- **Tingkat Keahlian**: Pengguna umum dengan kemampuan dasar pengoperasian web browser.

### 2.3 Batasan Sistem (Constraints)
1. **Penyimpanan**: Kapasitas data terbatas pada memori `localStorage` peramban pengguna (kisaran 5 MB).
2. **Sinkronisasi**: Tidak ada sinkronisasi *cloud* otomatis. Migrasi antar perangkat menggunakan mekanisme ekspor/impor file `.json`.
3. **Audio & Notifikasi**: Fitur *Web Audio API* dan *Push Notification* bergantung pada dukungan API browser yang digunakan pengguna.

---

## 3. Kebutuhan Fungsional (Functional Requirements)

### 3.1 Modul Manajemen Tugas (Task Hub)
- **FR-01 (Input Tugas Baru)**: Sistem harus menyediakan formulir input tugas dengan atribut: Nama Tugas, Mata Kuliah, Prioritas (*Santai, Biasa, Mendesak*), Tanggal Deadline, Catatan, dan File Lampiran.
- **FR-02 (Pengolahan Lampiran File)**: Sistem harus mampu membaca file lampiran lokal (PDF, DOCX, Gambar) menggunakan `FileReader API` dan mengonversinya ke bentuk *Base64* agar tersimpan di `localStorage`.
- **FR-03 (Penampilan & Filter Data)**: Sistem harus menampilkan daftar tugas aktif dalam bentuk kartu (*card*) dan menyediakan filter dinamis berdasarkan kategori Mata Kuliah.
- **FR-04 (Pembaruan & Status Tugas)**: Pengguna dapat mengedit data tugas (*Update*) serta menguji status penyelesaian (*Toggle Complete*) dengan indikator garis coret (*strikethrough*).
- **FR-05 (Penghapusan Tugas)**: Pengguna dapat menghapus tugas yang dipilih dari memori penyimpanan lokal.

### 3.2 Modul Kalender Bulanan Interaktif
- **FR-06 (Render Grid Kalender)**: Sistem harus merender tampilan kalender bulanan 7 kolom (Minggu - Sabtu) secara otomatis berdasarkan perhitungan objek `Date` JavaScript.
- **FR-07 (Indikator Tugas)**: Sistem harus menampilkan titik indikator warna (*task dot*) pada tanggal yang memiliki tugas aktif, dengan titik merah khusus untuk prioritas "Mendesak".
- **FR-08 (Pratinjau Tugas Harian)**: Pengguna dapat mengklik kotak tanggal pada kalender untuk melihat rincian seluruh tugas yang jatuh tempo pada tanggal tersebut.

### 3.3 Modul Countdown Target Ujian (UTS Widget)
- **FR-09 (Kalkulasi Hitung Mundur)**: Sistem harus mengalkulasi selisih hari antara tanggal target ujian dengan tanggal hari ini dan menampilkan status `H - X`.
- **FR-10 (Pengaturan Tanggal Target)**: Sistem menyediakan modal dialog kustom bagi pengguna untuk memperbarui tanggal target ujian yang tersimpan di `localStorage`.

### 3.4 Modul Timer Fokus Pomodoro & Lofi Audio Synth
- **FR-11 (Timer Pomodoro)**: Sistem menyediakan timer hitung mundur produktivitas berbasis waktu presisi (`Date.now()`) untuk menghindari akumulasi *delay* perulangan.
- **FR-12 (Penyuntingan Durasi)**: Pengguna dapat mengubah angka durasi timer secara langsung pada layar menggunakan atribut `contenteditable="true"`.
- **FR-13 (Sintesis Audio Ambient)**: Sistem harus mampu memproduksi nada musik ambient (*Lofi Chords*) secara instan menggunakan **Web Audio API** (`AudioContext`, `OscillatorNode`) tanpa mengunduh file MP3/WAV eksternal.

### 3.5 Modul Notifikasi & Keamanan Data
- **FR-14 (Toast & Push Reminder)**: Sistem memindai data tugas saat halaman dimuat dan menampilkan *Toast Notification* serta *Browser Push Notification* untuk tugas ber-deadline H-1 atau Hari H.
- **FR-15 (Backup & Restore Data)**: Sistem dapat mengekspor seluruh array tugas ke dalam file `.json` dan mengimpor file `.json` cadangan untuk memulihkan data.
- **FR-16 (Proteksi Akses Kode)**: Sistem membatasi pemicu *context menu* (klik kanan) dan kombinasi tombol *shortcut* Inspeksi Elemen (`F12`, `Ctrl+U`, `Ctrl+Shift+I`) untuk menjaga integritas tampilan kode.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **NFR-01 (Kinerja / Performance)**: Halaman aplikasi harus dapat dimuat secara instan (*lightweight*) dengan *time-to-interactive* < 2 detik karena seluruh aset berjalan secara lokal di klien.
- **NFR-02 (Keandalan / Reliability)**: Perubahan data tugas, preferensi tema, dan target tanggal UTS harus bertahan secara permanen (*persistent*) di peramban pengguna meskipun tab ditutup atau di-refresh.
- **NFR-03 (Kegunaan & Estetika / Usability)**: Antarmuka berbasis font *Poppins*, tata letak responsif, serta mendukung saklar *Dark Mode* untuk kenyamanan mata pengguna.
- **NFR-04 (Kompatibilitas / Compatibility)**: Aplikasi dapat berjalan normal pada peramban web utama (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge) di platform Desktop maupun Mobile.

---

## 5. Arsitektur & Teknologi

| Komponen | Teknologi / API |
|---|---|
| **User Interface (Markup)** | HTML5 Semantic Elements (`<header>`, `<nav>`, `<section>`, `<form>`, `<footer>`) |
| **Styling & Layout** | CSS3 (CSS Grid, Flexbox, CSS Variables, Media Queries) |
| **Logika & Manipulasi DOM** | Vanilla JavaScript (ES6+) |
| **Persistensi Data** | Web Storage API (`localStorage`), JSON Serialization |
| **Upload Lampiran** | FileReader API (`readAsDataURL`) |
| **Pengolahan Suara** | Web Audio API (`AudioContext`, `BiquadFilterNode`) |
| **Sistem Pengingat** | Notification API & Custom Dynamic DOM Toast |

---

### 👨‍💻 Pengembang
- **Nama**: Rafi' Akhdan Nizar
- **Program Studi**: D4 Manajemen Informatika - Universitas Negeri Surabaya (UNESA)