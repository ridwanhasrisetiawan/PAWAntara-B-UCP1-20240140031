// controllers/authController.js
const adminModel = require("../models/adminModel");

// GET /login - Halaman login
function getLoginPage(req, res) {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login Admin",
    activePage: "login",
  });
}

// POST /api/login - Validasi kredensial & buat sesi login
function postLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username dan password wajib diisi",
    });
  }

  const isValid = adminModel.verifyCredentials(username, password);

  if (!isValid) {
    return res.status(401).json({
      status: "error",
      message: "Username atau password salah",
    });
  }

  req.session.isAdmin = true;
  req.session.username = username;

  res.status(200).json({
    status: "success",
    message: "Login berhasil",
  });
}

// POST /api/logout - Hapus sesi login
function postLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal logout, coba lagi",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      status: "success",
      message: "Logout berhasil",
    });
  });
}

module.exports = { getLoginPage, postLogin, postLogout };
