// app.js
const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets (CSS/JS/gambar) lewat express.static
app.use(express.static(path.join(__dirname, "public")));

// Body parser untuk form (dipakai di Sprint 2 nanti, disiapkan dari sekarang)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware custom: request logger (FR-08)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/", productsRouter);

// 404 handler untuk route yang tidak dikenal
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Halaman Tidak Ditemukan",
    activePage: "",
  });
});

app.listen(PORT, () => {
  console.log(`Server Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
