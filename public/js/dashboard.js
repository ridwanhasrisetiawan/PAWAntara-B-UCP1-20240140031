// public/js/dashboard.js
// Dashboard admin: load, tambah, edit, hapus produk lewat Fetch API (async/await)

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("productForm");
  const tableBody = document.getElementById("productTableBody");
  const notice = document.getElementById("dashboardNotice");
  const formModeLabel = document.getElementById("formModeLabel");
  const submitBtn = document.getElementById("productSubmitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  const idInput = document.getElementById("productId");
  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");
  const descriptionInput = document.getElementById("description");

  function showNotice(message, type) {
    notice.textContent = message;
    notice.classList.remove("hidden", "border-market", "bg-market-light", "text-market-dark", "border-spice", "bg-spice/10", "text-spice");
    if (type === "success") {
      notice.classList.add("border-market", "bg-market-light", "text-market-dark");
    } else {
      notice.classList.add("border-spice", "bg-spice/10", "text-spice");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showFieldError(input, show) {
    const msg = form.querySelector(`.field-error[data-for="${input.id}"]`);
    if (msg) msg.classList.toggle("hidden", !show);
    input.classList.toggle("border-spice", show);
  }

  // Validasi dasar sebelum request dikirim (cegah submit kosong / nilai negatif)
  function validateForm() {
    let valid = true;

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, true);
      valid = false;
    } else {
      showFieldError(nameInput, false);
    }

    if (!categoryInput.value.trim()) {
      showFieldError(categoryInput, true);
      valid = false;
    } else {
      showFieldError(categoryInput, false);
    }

    if (priceInput.value === "" || Number(priceInput.value) < 0) {
      showFieldError(priceInput, true);
      valid = false;
    } else {
      showFieldError(priceInput, false);
    }

    if (stockInput.value === "" || Number(stockInput.value) < 0) {
      showFieldError(stockInput, true);
      valid = false;
    } else {
      showFieldError(stockInput, false);
    }

    return valid;
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    formModeLabel.textContent = "Tambah Produk Baru";
    submitBtn.textContent = "Simpan Produk";
    cancelEditBtn.classList.add("hidden");
    [nameInput, categoryInput, priceInput, stockInput].forEach((input) =>
      showFieldError(input, false)
    );
  }

  function renderRow(p) {
    const tr = document.createElement("tr");
    tr.className = "border-t border-ink/10";
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold">${escapeHtml(p.name)}</td>
      <td class="px-4 py-3 capitalize text-ink/70">${escapeHtml(p.category)}</td>
      <td class="px-4 py-3">Rp ${Number(p.price).toLocaleString("id-ID")}</td>
      <td class="px-4 py-3">${p.stock}</td>
      <td class="px-4 py-3">
        <div class="flex gap-2">
          <button data-action="edit" data-id="${p.id}" class="px-3 py-1.5 rounded-full text-xs font-bold bg-market-light text-market-dark border-2 border-market hover:bg-market hover:text-paper transition-colors">Edit</button>
          <button data-action="delete" data-id="${p.id}" class="px-3 py-1.5 rounded-full text-xs font-bold bg-spice/10 text-spice border-2 border-spice hover:bg-spice hover:text-paper transition-colors">Hapus</button>
        </div>
      </td>
    `;
    return tr;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  let productsCache = [];

  async function loadProducts() {
    tableBody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-ink/50">Memuat data produk...</td></tr>`;
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      productsCache = result.data || [];

      if (productsCache.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-ink/50">Belum ada produk.</td></tr>`;
        return;
      }

      tableBody.innerHTML = "";
      productsCache.forEach((p) => tableBody.appendChild(renderRow(p)));
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-center text-spice">Gagal memuat data produk.</td></tr>`;
    }
  }

  function fillFormForEdit(product) {
    idInput.value = product.id;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    priceInput.value = product.price;
    stockInput.value = product.stock;
    descriptionInput.value = product.description || "";

    formModeLabel.textContent = `Edit Produk: ${product.name}`;
    submitBtn.textContent = "Update Produk";
    cancelEditBtn.classList.remove("hidden");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Delegasi event untuk tombol edit/hapus di tabel
  tableBody.addEventListener("click", async function (e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "edit") {
      const product = productsCache.find((p) => p.id === id);
      if (product) fillFormForEdit(product);
      return;
    }

    if (action === "delete") {
      const product = productsCache.find((p) => p.id === id);
      const confirmed = confirm(
        `Yakin ingin menghapus "${product ? product.name : "produk ini"}"?`
      );
      if (!confirmed) return;

      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const result = await res.json();

        if (res.ok && result.status === "success") {
          showNotice(result.message || "Produk dihapus", "success");
          loadProducts();
        } else {
          showNotice(result.message || "Gagal menghapus produk", "error");
        }
      } catch (err) {
        showNotice("Terjadi kesalahan koneksi saat menghapus produk.", "error");
      }
    }
  });

  cancelEditBtn.addEventListener("click", resetForm);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: nameInput.value.trim(),
      category: categoryInput.value.trim(),
      price: Number(priceInput.value),
      stock: Number(stockInput.value),
      description: descriptionInput.value.trim(),
    };

    const editingId = idInput.value;
    const isEditing = !!editingId;

    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? "Menyimpan..." : "Menambahkan...";

    try {
      const res = await fetch(
        isEditing ? `/api/products/${editingId}` : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();

      if (res.ok && result.status === "success") {
        showNotice(result.message || "Berhasil disimpan", "success");
        resetForm();
        loadProducts();
      } else if (res.status === 401) {
        showNotice("Sesi login berakhir, silakan login ulang.", "error");
        setTimeout(() => (window.location.href = "/login"), 1200);
      } else {
        showNotice(result.message || "Gagal menyimpan produk", "error");
      }
    } catch (err) {
      showNotice("Terjadi kesalahan koneksi saat menyimpan produk.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isEditing ? "Update Produk" : "Simpan Produk";
    }
  });

  loadProducts();
});
