// public/js/login.js
// Validasi dasar (cegah submit kosong) + kirim login lewat Fetch API

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("loginError");
  const submitBtn = document.getElementById("loginSubmitBtn");

  function showFieldError(input, show) {
    const msg = form.querySelector(`.field-error[data-for="${input.id}"]`);
    if (msg) msg.classList.toggle("hidden", !show);
    input.classList.toggle("border-spice", show);
  }

  function showFormError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function hideFormError() {
    errorBox.classList.add("hidden");
  }

  function validate() {
    let valid = true;

    if (!usernameInput.value.trim()) {
      showFieldError(usernameInput, true);
      valid = false;
    } else {
      showFieldError(usernameInput, false);
    }

    if (!passwordInput.value.trim()) {
      showFieldError(passwordInput, true);
      valid = false;
    } else {
      showFieldError(passwordInput, false);
    }

    return valid;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideFormError();

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          password: passwordInput.value,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        window.location.href = "/dashboard";
      } else {
        showFormError(result.message || "Login gagal, coba lagi.");
      }
    } catch (err) {
      showFormError("Terjadi kesalahan koneksi ke server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
});
