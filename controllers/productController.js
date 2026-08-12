// controllers/productController.js
const productModel = require("../models/productModel");

// ===== HALAMAN (server-rendered) =====

// GET / - Beranda
function getBeranda(req, res) {
  const preview = productModel.getAll().slice(0, 4);
  res.render("index", {
    title: "Beranda",
    activePage: "beranda",
    preview,
  });
}

// GET /produk - Shell halaman produk publik.
// Data produk TIDAK di-render dari server lagi (Sprint 2): halaman ini
// mengambil datanya secara dinamis lewat GET /api/products di sisi client
// (lihat public/js/produk.js), supaya perubahan dari dashboard admin
// langsung terlihat tanpa restart server / reload manual.
function getProdukPage(req, res) {
  res.render("produk", {
    title: "Produk",
    activePage: "produk",
  });
}

// GET /produk/:id - Detail produk dinamis (tetap SSR, baca dari model yang sama)
function getProdukDetail(req, res) {
  const id = parseInt(req.params.id, 10);
  const product = !isNaN(id) ? productModel.getById(id) : null;

  if (product) {
    return res.render("produk-detail", {
      title: product.name,
      activePage: "produk",
      product,
      found: true,
    });
  }

  res.status(404).render("produk-detail", {
    title: "Produk Tidak Ditemukan",
    activePage: "produk",
    product: null,
    found: false,
  });
}

// GET /tanya-ai - Halaman chat
function getTanyaAI(req, res) {
  res.render("tanya-ai", {
    title: "Tanya AI",
    activePage: "tanya-ai",
  });
}

// GET /dashboard - Dashboard admin (dilindungi middleware auth di route-nya)
function getDashboard(req, res) {
  res.render("dashboard", {
    title: "Dashboard Admin",
    activePage: "dashboard",
  });
}

// ===== REST API =====

// GET /api/products?kategori=&search= - Publik, read-only
function apiGetAll(req, res) {
  const { kategori, search } = req.query;
  const data = productModel.getAll({ kategori, search });

  res.status(200).json({
    status: "success",
    message: "Data produk berhasil diambil",
    data,
  });
}

// GET /api/products/:id - Publik
function apiGetById(req, res) {
  const id = parseInt(req.params.id, 10);
  const product = !isNaN(id) ? productModel.getById(id) : null;

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
}

// POST /api/products - Wajib login
function apiCreate(req, res) {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Field name, category, price, dan stock wajib diisi",
    });
  }

  if (isNaN(Number(price)) || isNaN(Number(stock))) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka",
    });
  }

  const newProduct = productModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Produk ditambahkan",
    data: newProduct,
  });
}

// PUT /api/products/:id - Wajib login
function apiUpdate(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: "error",
      message: "ID produk tidak valid",
    });
  }

  const { price, stock } = req.body;
  if (
    (price !== undefined && isNaN(Number(price))) ||
    (stock !== undefined && isNaN(Number(stock)))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Price dan stock harus berupa angka",
    });
  }

  const updated = productModel.update(id, req.body);

  if (!updated) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Produk diperbarui",
    data: updated,
  });
}

// DELETE /api/products/:id - Wajib login
function apiDelete(req, res) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: "error",
      message: "ID produk tidak valid",
    });
  }

  const success = productModel.remove(id);

  if (!success) {
    return res.status(404).json({
      status: "error",
      message: "Produk tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Produk dihapus",
  });
}

module.exports = {
  getBeranda,
  getProdukPage,
  getProdukDetail,
  getTanyaAI,
  getDashboard,
  apiGetAll,
  apiGetById,
  apiCreate,
  apiUpdate,
  apiDelete,
};
