# Toko Sembako Ariesta — Sprint 1

Fondasi website Toko Sembako Ariesta: struktur halaman, styling responsif, dan server Express dasar dengan EJS.

## Cara Menjalankan

```bash
npm install
npm run dev     # pakai nodemon (auto-restart)
# atau
npm start        # tanpa nodemon
```

Server berjalan di `http://localhost:3000`.

## Struktur Project

```
toko-ariesta/
├── app.js                  # Entry point Express
├── data/
│   └── products.js         # Data produk dummy (array in-memory)
├── routes/
│   └── products.js         # Semua route halaman + API
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs      # Navbar + hamburger (dipakai di semua halaman)
│   │   └── footer.ejs
│   ├── index.ejs           # Beranda
│   ├── produk.ejs          # Daftar produk + filter
│   ├── produk-detail.ejs   # Detail produk dinamis
│   ├── tanya-ai.ejs        # Halaman chat (tampilan saja)
│   └── 404.ejs
└── public/
    ├── css/style.css       # Hanya animasi hamburger -> X (styling utama pakai Tailwind CDN)
    └── js/main.js          # Toggle hamburger menu (vanilla JS)
```

## Styling

Project ini pakai **Tailwind CSS lewat CDN** (`<script src="https://cdn.tailwindcss.com">` di `views/partials/head.ejs`), sesuai ketentuan Sprint 1. Hampir semua styling langsung pakai utility class Tailwind di setiap file `.ejs`. File `public/css/style.css` hanya berisi animasi transisi hamburger -> X yang lebih rapi ditulis manual, serta `scroll-behavior: smooth`.

## Route yang Tersedia

| Method | Route | Deskripsi |
|--------|-------|-----------|
| GET | `/` | Beranda + preview produk |
| GET | `/produk` | Daftar semua produk, mendukung `?kategori=` & `?search=` |
| GET | `/produk/:id` | Detail 1 produk berdasarkan ID (404 jika tidak ditemukan) |
| GET | `/tanya-ai` | Halaman chat (belum ada logic balasan) |
| GET | `/api/products` | REST API read-only, mengembalikan JSON semua produk |

## Catatan

- Belum ada database/autentikasi — semua data masih array dummy di `data/products.js`, sesuai lingkup Sprint 1.
- REST API CRUD penuh, login admin, dan fitur Tanya AI (balasan dummy) akan dikerjakan di Sprint 2.
- Tidak ada pemanggilan API AI eksternal di project ini.
