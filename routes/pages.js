// routes/pages.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const { requireAuthPage } = require("../middleware/auth");

router.get("/", productController.getBeranda);
router.get("/produk", productController.getProdukPage);
router.get("/produk/:id", productController.getProdukDetail);
router.get("/tanya-ai", productController.getTanyaAI);

router.get("/login", authController.getLoginPage);

// Dashboard hanya bisa diakses setelah login
router.get("/dashboard", requireAuthPage, productController.getDashboard);

module.exports = router;
