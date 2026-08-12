// models/productModel.js
// "Model" sederhana: satu sumber data in-memory yang dipakai bersama
// oleh endpoint GET (baca) maupun POST/PUT/DELETE (mutasi) - Sprint 2 FR

const seedProducts = require("../data/products");

// Simpan sebagai state module-level supaya perubahan (add/edit/delete)
// konsisten selama server berjalan, dan dibaca dari sumber yang sama.
let products = [...seedProducts];
let nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;

function getAll({ kategori, search } = {}) {
  let result = products;

  if (kategori) {
    result = result.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    const keyword = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  return result;
}

function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}

function getById(id) {
  return products.find((p) => p.id === id) || null;
}

function create(data) {
  const newProduct = {
    id: nextId++,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    image: data.image || "/img/default.jpg",
    description: data.description || "",
  };
  products.push(newProduct);
  return newProduct;
}

function update(id, data) {
  const product = products.find((p) => p.id === id);
  if (!product) return null;

  if (data.name !== undefined) product.name = data.name;
  if (data.category !== undefined) product.category = data.category;
  if (data.price !== undefined) product.price = Number(data.price);
  if (data.stock !== undefined) product.stock = Number(data.stock);
  if (data.image !== undefined) product.image = data.image;
  if (data.description !== undefined) product.description = data.description;

  return product;
}

function remove(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getCategories,
  getById,
  create,
  update,
  remove,
};
