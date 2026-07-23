# DoIt

A simple To Do List Website — aplikasi daftar tugas sederhana untuk membuat, mengedit, menandai selesai, dan menghapus tugas.

## Deskripsi

DoIt adalah aplikasi web kecil untuk mengelola tugas harian. Dirancang agar ringan dan mudah dikembangkan, proyek ini berisi kode utama berbasis JavaScript dengan sebagian komponen atau utilitas dalam TypeScript, serta styling menggunakan CSS. Cocok sebagai contoh proyek pemula atau bahan latihan React/Vite.

## Fitur

- Tambah tugas baru
- Tandai tugas sebagai selesai/belum selesai
- Edit tugas
- Hapus tugas
- Penyimpanan sederhana (lokal) — bila diimplementasikan

## Teknologi

- JavaScript (utama)
- TypeScript (beberapa file/utilitas)
- HTML, CSS
- Vite (dev server dan build) — jika proyek dibuat dari template Vite
- React (jika digunakan dalam kode sumber)

> Catatan: Sesuaikan bagian "Teknologi" jika Anda mengganti stack (mis. plain JS tanpa React). Saya menuliskan teknologi sesuai komposisi bahasa repo (JavaScript + TypeScript) dan README template awal.

## Instalasi

1. Clone repo

   git clone https://github.com/bivanoid/DoIt.git
   cd DoIt

2. Install dependensi

   npm install
   
   atau jika menggunakan yarn:

   yarn

## Menjalankan dalam mode pengembangan

Jalankan dev server:

npm run dev

Buka http://localhost:5173 (atau port lain yang ditampilkan) untuk melihat aplikasi.

## Build untuk produksi

Untuk membuat berkas produksi:

npm run build

Untuk melihat hasil build secara lokal (preview):

npm run preview

## Struktur proyek (contoh)

- src/ — kode sumber aplikasi
  - components/ — komponen UI
  - pages/ atau views/ — halaman/halaman utama
  - styles/ — file CSS
  - main.js / main.tsx — entrypoint
- public/ — aset statis (ikon, favicon)
- index.html

Sesuaikan struktur di atas dengan struktur aktual repositori jika berbeda.

## Cara penggunaan

- Ketik nama tugas baru pada input, lalu tekan Enter atau klik tombol "Tambah" untuk menyimpan tugas.
- Klik checkbox atau tombol untuk menandai tugas selesai / belum selesai.
- Klik ikon edit untuk mengubah teks tugas.
- Klik ikon hapus untuk menghapus tugas.

## Kontribusi

Kontribusi diterima! Buat issue atau pull request untuk menambah fitur, memperbaiki bug, atau meningkatkan dokumentasi.

Panduan singkat:

1. Fork repo
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "Menambahkan fitur ..."`
4. Push ke fork Anda dan buat Pull Request

## Lisensi

Lisensi belum ditentukan dalam repo. Jika Anda ingin menambahkan lisensi, misalnya MIT, tambahkan file `LICENSE` dengan konten lisensi yang sesuai.

---

Jika Anda ingin, saya bisa menyesuaikan README ini lebih spesifik berdasarkan struktur file dan dependensi aktual dalam repo (mis. package.json, apakah pakai React, library penyimpanan, dsb.). Beri tahu saya kalau ingin versi yang lebih detail dan saya akan menyesuaikannya.
