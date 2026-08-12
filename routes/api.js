// routes/api.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const { requireAuthApi } = require("../middleware/auth");

// Auth
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

// Produk - baca (publik)
router.get("/products", productController.apiGetAll);
router.get("/products/:id", productController.apiGetById);

// Produk - mutasi (wajib login, dicek di server lewat middleware)
router.post("/products", requireAuthApi, productController.apiCreate);
router.put("/products/:id", requireAuthApi, productController.apiUpdate);
router.delete("/products/:id", requireAuthApi, productController.apiDelete);

// Chat AI dummy
router.post("/chat", chatController.postChat);

module.exports = router;
