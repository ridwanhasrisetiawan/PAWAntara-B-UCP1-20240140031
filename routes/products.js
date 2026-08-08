// routes/products.js
const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET / - Beranda
router.get("/", (req, res) => {
  const preview = products.slice(0, 4); // ambil 4 produk pertama untuk preview
  res.render("index", {
    title: "Beranda",
    activePage: "beranda",
    preview,
  });
});

// GET /produk - Daftar semua produk + filter lewat query string
router.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  let filtered = products;

  if (kategori) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
  }

  // Daftar kategori unik untuk dropdown filter
  const categories = [...new Set(products.map((p) => p.category))];

  res.render("produk", {
    title: "Produk",
    activePage: "produk",
    products: filtered,
    categories,
    selectedKategori: kategori || "",
    searchTerm: search || "",
  });
});

// GET /produk/:id - Detail produk dinamis
router.get("/produk/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!isNaN(id) && product) {
    return res.render("produk-detail", {
      title: product.name,
      activePage: "produk",
      product,
      found: true,
    });
  }

  // ID tidak valid / tidak ditemukan -> tampilkan pesan, bukan crash
  res.status(404).render("produk-detail", {
    title: "Produk Tidak Ditemukan",
    activePage: "produk",
    product: null,
    found: false,
  });
});

// GET /tanya-ai - Halaman chat (tampilan saja, belum ada logic balasan)
router.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    title: "Tanya AI",
    activePage: "tanya-ai",
  });
});

// GET /api/products - REST API read-only, mengembalikan JSON
router.get("/api/products", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Data produk berhasil diambil",
    data: products,
  });
});

module.exports = router;
