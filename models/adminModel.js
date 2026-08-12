// models/adminModel.js
// Akun admin/kasir - kredensial diambil dari .env (bukan hardcode plain text
// yang ikut ter-commit). Password disimpan dalam bentuk hash bcrypt.

const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

function verifyCredentials(username, password) {
  if (!username || !password) return false;
  if (username !== ADMIN_USERNAME) return false;
  if (!ADMIN_PASSWORD_HASH) return false;

  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

module.exports = {
  verifyCredentials,
  ADMIN_USERNAME,
};
