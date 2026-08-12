// public/js/chat.js
// Halaman Tanya AI: kirim pertanyaan lewat Fetch API (async/await) ke
// POST /api/chat, lalu render bubble chat pelanggan & balasan server ke DOM.

document.addEventListener("DOMContentLoaded", function () {
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatSubmitBtn = document.getElementById("chatSubmitBtn");

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function showFieldError(show) {
    const msg = chatForm.querySelector('.field-error[data-for="chatInput"]');
    if (msg) msg.classList.toggle("hidden", !show);
    chatInput.classList.toggle("border-spice", show);
  }

  function appendBubble(text, sender) {
    const bubble = document.createElement("div");
    if (sender === "user") {
      bubble.className =
        "max-w-[85%] bg-tag/40 border-2 border-tag rounded-2xl rounded-br-sm px-4 py-3 text-sm self-end";
    } else {
      bubble.className =
        "max-w-[85%] bg-market-light border-2 border-market rounded-2xl rounded-bl-sm px-4 py-3 text-sm self-start";
    }
    bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return bubble;
  }

  function appendTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className =
      "max-w-[60%] bg-market-light border-2 border-market rounded-2xl rounded-bl-sm px-4 py-3 text-sm self-start italic text-ink/50";
    bubble.textContent = "Mengetik...";
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return bubble;
  }

  async function sendMessage(message) {
    appendBubble(message, "user");
    const typingBubble = appendTypingIndicator();

    chatSubmitBtn.disabled = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const result = await res.json();

      typingBubble.remove();

      if (res.ok && result.status === "success") {
        appendBubble(result.data.reply, "bot");
      } else {
        appendBubble(result.message || "Maaf, terjadi kesalahan di server.", "bot");
      }
    } catch (err) {
      typingBubble.remove();
      appendBubble("Gagal terhubung ke server. Coba lagi ya.", "bot");
    } finally {
      chatSubmitBtn.disabled = false;
    }
  }

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const message = chatInput.value.trim();

    if (!message) {
      showFieldError(true);
      return;
    }
    showFieldError(false);

    chatInput.value = "";
    sendMessage(message);
  });

  // Klik contoh pertanyaan -> otomatis isi & kirim
  document.querySelectorAll(".chat-suggestion").forEach((btn) => {
    btn.addEventListener("click", function () {
      const text = btn.textContent.replace(/"/g, "");
      showFieldError(false);
      sendMessage(text);
    });
  });
});
