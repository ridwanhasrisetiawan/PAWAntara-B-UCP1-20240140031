// app.js
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const pagesRouter = require("./routes/pages");
const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets (CSS/JS/gambar) lewat express.static
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session (login admin/kasir)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "toko-ariesta-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 jam
    },
  })
);

// Middleware custom #1: request logger (method + endpoint + waktu)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware custom #2: sediakan status login ke semua view (buat navbar)
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!(req.session && req.session.isAdmin);
  res.locals.adminUsername = req.session ? req.session.username : null;
  next();
});

// Routes
app.use("/api", apiRouter);
app.use("/", pagesRouter);

// 404 handler untuk route yang tidak dikenal
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Halaman Tidak Ditemukan",
    activePage: "",
  });
});

app.listen(PORT, () => {
  console.log(`Server Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
