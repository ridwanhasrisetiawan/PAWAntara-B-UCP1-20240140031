// controllers/chatController.js
// Logika balasan "AI" 100% dummy buatan sendiri di backend (keyword matching).
// TIDAK memanggil API AI eksternal apa pun.

const productModel = require("../models/productModel");

const RULES = [
  {
    keywords: ["jam buka", "jam operasional", "buka jam", "tutup jam", "buka sampai"],
    reply: "Toko kami buka setiap hari jam 07.00 - 20.00 WIB. Ditunggu kedatangannya ya!",
  },
  {
    keywords: ["ongkir", "antar", "kirim", "delivery", "diantar"],
    reply: "Bisa diantar untuk area sekitar toko dengan ongkir mulai Rp5.000. Hubungi WhatsApp kami di 0812-3456-7890 untuk konfirmasi alamat.",
  },
  {
    keywords: ["bayar", "pembayaran", "transfer", "cod", "qris"],
    reply: "Pembayaran bisa lewat tunai (COD), transfer bank, atau QRIS. Semua metode tersedia saat pemesanan.",
  },
  {
    keywords: ["stok", "tersedia", "ada gak", "ada ga", "masih ada"],
    reply: "Stok produk bisa langsung kamu cek di halaman Produk, datanya selalu ter-update sesuai kondisi toko.",
  },
  {
    keywords: ["harga", "berapa", "harganya"],
    reply: "Untuk daftar harga terbaru, silakan cek halaman Produk kami - semua harga tercantum jelas di sana.",
  },
  {
    keywords: ["halo", "hai", "hi", "assalamualaikum", "selamat"],
    reply: "Halo juga! Ada yang bisa aku bantu seputar produk, harga, stok, atau jam operasional toko?",
  },
  {
    keywords: ["terima kasih", "makasih", "thanks"],
    reply: "Sama-sama! Senang bisa membantu. Selamat berbelanja di Toko Sembako Ariesta 😊",
  },
];

const FALLBACK_REPLIES = [
  "Maaf, aku belum paham pertanyaan itu. Coba tanyakan soal jam buka, ongkir, cara pembayaran, atau ketersediaan stok ya.",
  "Hmm, aku belum punya jawaban untuk itu. Kamu bisa tanya soal produk, harga, stok, atau pengiriman.",
  "Pertanyaan itu belum aku kenali. Coba tanya hal seputar toko, misalnya jam operasional atau cara bayar.",
];

function findReply(message) {
  const text = message.toLowerCase();

  // Pertanyaan spesifik tentang satu produk (contoh: "beras masih ada?")
  const products = productModel.getAll();
  const mentionedProduct = products.find((p) =>
    text.includes(p.name.toLowerCase().split(" ")[0])
  );

  for (const rule of RULES) {
    const matched = rule.keywords.some((kw) => text.includes(kw));
    if (matched) {
      if (rule.keywords[0] === "stok" && mentionedProduct) {
        return `Stok "${mentionedProduct.name}" saat ini ada ${mentionedProduct.stock} unit, harga Rp${mentionedProduct.price.toLocaleString("id-ID")}.`;
      }
      return rule.reply;
    }
  }

  const randomIndex = Math.floor(Math.random() * FALLBACK_REPLIES.length);
  return FALLBACK_REPLIES[randomIndex];
}

// POST /api/chat
function postChat(req, res) {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      status: "error",
      message: "Pertanyaan tidak boleh kosong",
    });
  }

  const reply = findReply(message.trim());

  res.status(200).json({
    status: "success",
    data: { reply },
  });
}

module.exports = { postChat };
