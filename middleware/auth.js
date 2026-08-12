// middleware/auth.js

// Melindungi halaman (redirect ke /login kalau belum login)
function requireAuthPage(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.redirect("/login");
}

// Melindungi endpoint API (401 JSON kalau belum login)
// Dipakai di POST/PUT/DELETE /api/products - request langsung lewat
// Postman tanpa sesi login pun tetap ditolak di server, bukan cuma
// disembunyikan di frontend.
function requireAuthApi(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({
    status: "error",
    message: "Unauthorized, silakan login terlebih dahulu",
  });
}

module.exports = { requireAuthPage, requireAuthApi };
