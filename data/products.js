// data/products.js
// Data produk dummy - Sprint 1 (array in-memory, belum pakai database)

const products = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    category: "sembako",
    price: 65000,
    stock: 20,
    image: "/img/beras.jpg",
    description: "Beras putih pulen kualitas premium, kemasan 5kg, cocok untuk kebutuhan rumah tangga sehari-hari.",
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "sembako",
    price: 34000,
    stock: 15,
    image: "/img/minyak.jpg",
    description: "Minyak goreng kemasan botol 2 liter, jernih dan tidak mudah tengik.",
  },
  {
    id: 3,
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 16000,
    stock: 30,
    image: "/img/gula.jpg",
    description: "Gula pasir putih kristal halus, kemasan 1kg, cocok untuk kebutuhan dapur.",
  },
  {
    id: 4,
    name: "Telur Ayam 1kg",
    category: "protein",
    price: 28000,
    stock: 25,
    image: "/img/telur.jpg",
    description: "Telur ayam negeri segar, ukuran sedang-besar, dijual per kilogram.",
  },
  {
    id: 5,
    name: "Tepung Terigu 1kg",
    category: "sembako",
    price: 12000,
    stock: 18,
    image: "/img/tepung.jpg",
    description: "Tepung terigu serbaguna untuk membuat kue, gorengan, dan aneka masakan.",
  },
  {
    id: 6,
    name: "Kecap Manis 600ml",
    category: "bumbu",
    price: 22000,
    stock: 12,
    image: "/img/kecap.jpg",
    description: "Kecap manis kental dengan rasa gurih dan manis khas, kemasan botol 600ml.",
  },
  {
    id: 7,
    name: "Garam Dapur 500gr",
    category: "bumbu",
    price: 5000,
    stock: 40,
    image: "/img/garam.jpg",
    description: "Garam dapur beryodium, kemasan 500 gram.",
  },
  {
    id: 8,
    name: "Mie Instan (1 Dus)",
    category: "instan",
    price: 110000,
    stock: 10,
    image: "/img/mie.jpg",
    description: "Mie instan rasa ayam bawang, 1 dus isi 40 bungkus.",
  },
];

module.exports = products;
