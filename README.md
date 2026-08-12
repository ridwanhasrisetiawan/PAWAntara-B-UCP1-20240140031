# Toko Sembako Ariesta — Sprint 1 & 2

Nama: Ridwan Hasri Setiawan
NIM: 20240140031
Kelas: B


Website toko sembako milik Ibu Aries: halaman publik (beranda, produk, detail produk, chat AI dummy) plus dashboard admin dengan login untuk mengelola produk secara real-time lewat REST API.

## Cara Menjalankan

1. Clone repo lalu masuk ke foldernya.
2. Install dependency:
   ```bash
   npm install
   ```
3. Siapkan file `.env` (lihat bagian **Environment Variables** di bawah). Contoh cepat:
   ```bash
   cp .env.example .env
   ```
   lalu isi `ADMIN_PASSWORD_HASH` (lihat cara generate di bawah).
4. Jalankan server:
   ```bash
   npm run dev     # pakai nodemon (auto-restart saat kode berubah)
   # atau
   npm start        # tanpa nodemon
   ```
5. Buka `http://localhost:3000`.

## Environment Variables (`.env`)

File `.env` **tidak ikut ter-commit** (lihat `.gitignore`) karena berisi secret. Salin dari `.env.example` lalu isi:

| Variable | Keterangan |
|---|---|
| `SESSION_SECRET` | String rahasia untuk enkripsi session login, isi bebas string acak |
| `ADMIN_USERNAME` | Username admin/kasir |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt dari password admin (bukan plain text) |
| `PORT` | Port server, default `3000` |

Generate `ADMIN_PASSWORD_HASH` dari password pilihanmu:
```bash
node -e "console.log(require('bcryptjs').hashSync('password_kamu', 10))"
```
Tempel hasilnya ke `.env`.

### Kredensial Admin untuk Pengecekan Asisten

```
Username : admin
Password : admin123
```
(Sesuai hash bawaan di `.env.example` bila di-generate dengan password di atas — silakan sesuaikan sendiri saat deploy.)

## Struktur Project

```
toko-ariesta/
├── app.js                        # Entry point Express (session, dotenv, middleware, routing)
├── controllers/
│   ├── productController.js      # Logic halaman produk + REST API CRUD produk
│   ├── authController.js         # Logic login/logout
│   └── chatController.js         # Logic balasan dummy "Tanya AI" (keyword matching)
├── middleware/
│   └── auth.js                   # requireAuthPage (redirect) & requireAuthApi (401 JSON)
├── models/
│   ├── productModel.js           # Satu sumber data in-memory (dipakai GET & mutasi)
│   └── adminModel.js             # Verifikasi kredensial admin (bcrypt, dari .env)
├── data/
│   └── products.js               # Seed data produk dummy awal
├── routes/
│   ├── pages.js                  # Route halaman (EJS)
│   └── api.js                    # Route REST API (/api/...)
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs            # Navbar + hamburger + status login (Dashboard/Login/Logout)
│   │   ├── footer.ejs
│   │   └── product-card.ejs      # Komponen kartu produk gaya "label harga" (SSR, dipakai di Beranda)
│   ├── index.ejs                 # Beranda
│   ├── produk.ejs                # Daftar produk publik (fetch dinamis dari API)
│   ├── produk-detail.ejs         # Detail produk dinamis (SSR)
│   ├── tanya-ai.ejs              # Chat AI (fetch dinamis ke /api/chat)
│   ├── login.ejs                 # Form login admin
│   ├── dashboard.ejs             # Dashboard CRUD produk (dilindungi login)
│   └── 404.ejs
└── public/
    ├── css/style.css             # Detail kecil yang butuh CSS manual (styling utama pakai Tailwind CDN)
    └── js/
        ├── main.js               # Hamburger menu + tombol logout
        ├── login.js               # Validasi + submit form login (Fetch API)
        ├── dashboard.js           # CRUD produk dari dashboard (Fetch API)
        ├── produk.js              # Ambil & filter produk publik (Fetch API)
        └── chat.js                # Kirim/terima pesan Tanya AI (Fetch API)
```

Struktur mengikuti pola **MVC**: `routes/` memetakan URL ke `controllers/`, `controllers/` memproses request dan memanggil `models/` untuk baca/tulis data, `views/` (EJS) untuk render halaman. `models/productModel.js` jadi **satu-satunya sumber data** yang dipakai baik oleh endpoint baca (`GET`) maupun endpoint mutasi (`POST/PUT/DELETE`), jadi perubahan dari dashboard langsung konsisten terlihat di halaman publik.

## Konsep Desain

UI mengangkat suasana **papan harga pasar tradisional**: warna hijau tua & jingga rempah di atas kertas krem, font display *Fraunces* untuk judul, dipadukan *Space Grotesk* untuk teks. Elemen khasnya adalah kartu produk berbentuk **label harga gantung** (ada "lubang" di atas, garis outline tebal, sedikit miring saat di-hover). Styling utama pakai **Tailwind CDN**.

## Route Halaman

| Method | Route | Akses | Deskripsi |
|---|---|---|---|
| GET | `/` | Publik | Beranda + preview produk |
| GET | `/produk` | Publik | Daftar produk (data diambil dinamis lewat Fetch API dari `/api/products`) |
| GET | `/produk/:id` | Publik | Detail 1 produk (404 rapi jika tidak ditemukan) |
| GET | `/tanya-ai` | Publik | Chat AI dummy (dinamis via Fetch API ke `/api/chat`) |
| GET | `/login` | Publik | Form login admin/kasir |
| GET | `/dashboard` | **Login** | Kelola produk (CRUD via Fetch API) |

## REST API

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/login` | Publik | Login, membuat sesi (session cookie) |
| POST | `/api/logout` | Login | Hapus sesi login |
| GET | `/api/products` | Publik | Semua produk, mendukung `?kategori=` & `?search=` |
| GET | `/api/products/:id` | Publik | Detail 1 produk |
| POST | `/api/products` | **Login** | Tambah produk baru |
| PUT | `/api/products/:id` | **Login** | Update produk (harga/stok/dll) |
| DELETE | `/api/products/:id` | **Login** | Hapus produk |
| POST | `/api/chat` | Publik | Kirim pertanyaan, balasan dummy dari backend |

Semua response API konsisten format `{ status, message?, data? }`. Endpoint yang butuh login akan menolak request tanpa sesi aktif dengan `401 { status: "error", message: "Unauthorized, silakan login terlebih dahulu" }` — **dicek betul di server**, jadi tetap ditolak walau di-hit langsung lewat Postman tanpa lewat UI.

## Keamanan & Middleware

- **Session-based auth** (`express-session`) — bukan disimpan di frontend saja.
- **Password admin di-hash dengan bcrypt**, tidak pernah disimpan/dibandingkan sebagai plain text; kredensial asli ada di `.env` yang tidak ikut ter-commit.
- **Middleware custom**:
  1. Request logger — mencatat method + endpoint + waktu setiap request masuk (`app.js`).
  2. Auth middleware — `requireAuthPage` (redirect ke `/login`) dan `requireAuthApi` (401 JSON) di `middleware/auth.js`.
- **Validasi input**: dilakukan di server (semua controller) *dan* di client (JS di `public/js/`) sebelum request dikirim — mencegah submit kosong di form login, form produk, dan form chat.

## Fitur "Tanya AI"

Balasan 100% logika buatan sendiri di backend (`controllers/chatController.js`) — keyword matching untuk jam buka, ongkir, cara pembayaran, dan ketersediaan stok, dengan fallback acak kalau tidak dikenali. **Tidak ada pemanggilan API AI eksternal (OpenAI/Anthropic/Gemini/dsb) di project ini.**

## Data

Data produk & akun admin memakai **array in-memory** (`models/productModel.js` & `models/adminModel.js`). Artinya perubahan dari dashboard akan hilang saat server di-restart — sesuai ketentuan tugas yang membolehkan pilihan in-memory untuk sesi ini.
