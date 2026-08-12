// public/js/produk.js
// Halaman Produk publik (Sprint 2): data diambil dinamis dari GET /api/products,
// filter dikirim ulang lewat Fetch API tanpa reload halaman penuh.

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("productGrid");
  const resultCount = document.getElementById("resultCount");
  const filterForm = document.getElementById("filterForm");
  const searchInput = document.getElementById("search");
  const kategoriSelect = document.getElementById("kategori");
  const resetBtn = document.getElementById("resetFilterBtn");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCard(p) {
    return `
      <article class="price-tag group relative bg-white border-2 border-ink rounded-2xl pt-7 pb-5 px-5 flex flex-col gap-1 transition-transform duration-200 hover:-rotate-1 hover:-translate-y-1">
        <span class="tag-hole" aria-hidden="true"></span>
        <div class="text-4xl mb-1" aria-hidden="true">📦</div>
        <h3 class="font-display font-semibold text-ink leading-snug">${escapeHtml(p.name)}</h3>
        <p class="text-xs uppercase tracking-wide text-ink/50 font-body">${escapeHtml(p.category)}</p>
        <p class="font-display font-black text-spice text-xl mt-1">Rp ${Number(p.price).toLocaleString("id-ID")}</p>
        <p class="text-xs text-ink/60 font-body">Stok: ${p.stock}</p>
        <a href="/produk/${p.id}" class="mt-3 text-center bg-market text-paper rounded-full py-2 text-sm font-semibold font-body hover:bg-market-dark transition-colors">Lihat Detail</a>
      </article>
    `;
  }

  function populateCategories(products, selected) {
    const categories = [...new Set(products.map((p) => p.category))];
    kategoriSelect.innerHTML = '<option value="">Semua Kategori</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (cat === selected) option.selected = true;
      kategoriSelect.appendChild(option);
    });
  }

  let allProductsCache = null;

  async function loadCategories(selected) {
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      allProductsCache = result.data || [];
      populateCategories(allProductsCache, selected);
    } catch (err) {
      // Kalau gagal, dropdown tetap cuma "Semua Kategori" - tidak fatal
    }
  }

  async function fetchProducts(params = {}) {
    grid.innerHTML = `<p class="col-span-full text-center text-ink/50 py-12 font-display">Memuat produk...</p>`;

    const query = new URLSearchParams();
    if (params.kategori) query.set("kategori", params.kategori);
    if (params.search) query.set("search", params.search);

    try {
      const res = await fetch(`/api/products${query.toString() ? "?" + query.toString() : ""}`);
      const result = await res.json();
      const products = result.data || [];

      if (products.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-ink/60 py-16 font-display text-lg">Tidak ada produk yang cocok dengan filter kamu.</p>`;
        resultCount.textContent = "";
        return;
      }

      resultCount.textContent = `${products.length} produk ditemukan.`;
      grid.innerHTML = products.map(renderCard).join("");
    } catch (err) {
      grid.innerHTML = `<p class="col-span-full text-center text-spice py-12 font-display">Gagal memuat data produk. Coba muat ulang halaman.</p>`;
    }
  }

  // Isi filter dari query string URL saat pertama kali buka halaman
  const initialParams = new URLSearchParams(window.location.search);
  const initialKategori = initialParams.get("kategori") || "";
  const initialSearch = initialParams.get("search") || "";
  searchInput.value = initialSearch;

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const kategori = kategoriSelect.value;
    const search = searchInput.value.trim();

    // Update URL biar bisa di-share / bookmark tanpa reload
    const params = new URLSearchParams();
    if (kategori) params.set("kategori", kategori);
    if (search) params.set("search", search);
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);

    fetchProducts({ kategori, search });
  });

  resetBtn.addEventListener("click", function () {
    searchInput.value = "";
    kategoriSelect.value = "";
    window.history.replaceState({}, "", window.location.pathname);
    fetchProducts();
  });

  loadCategories(initialKategori);
  fetchProducts({ kategori: initialKategori, search: initialSearch });
});
