// -------------------- THEME TOGGLE --------------------
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-bs-theme");
    if (currentTheme === "dark") {
      body.setAttribute("data-bs-theme", "light");
      themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
      themeToggle.classList.replace("btn-outline-light", "btn-outline-dark");
    } else {
      body.setAttribute("data-bs-theme", "dark");
      themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
      themeToggle.classList.replace("btn-outline-dark", "btn-outline-light");
    }
  });
}

// -------------------- CONTACT FORM --------------------
const form = document.getElementById("formContact");
const popup = document.getElementById("popupMessage");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lock scroll to the Contact section immediately
    const contactSection = document.getElementById("Contact");
    const contactTop =
      contactSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: contactTop, behavior: "instant" });

    // Clear previous errors
    document
      .querySelectorAll(".error-msg")
      .forEach((el) => (el.textContent = ""));
    let hasError = false;

    const name = form.name.value.trim();
    if (!name) {
      document.getElementById("nameError").textContent = "Name is required.";
      hasError = true;
    }

    const email = form.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      document.getElementById("emailError").textContent = "Email is required.";
      hasError = true;
    } else if (!emailRegex.test(email)) {
      document.getElementById("emailError").textContent =
        "Invalid email format.";
      hasError = true;
    }

    const message = form.message.value.trim();
    if (!message) {
      document.getElementById("messageError").textContent =
        "Message is required.";
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const text = await res.text();
      showGlobalPopup(text || "Message sent successfully!", true);
      form.reset();
    } catch (err) {
      showGlobalPopup("Error sending message. Please try again.", false);
      console.error(err);
    }

    // Re-lock scroll after fetch in case browser moved it
    window.scrollTo({ top: contactTop, behavior: "instant" });
  });
}

// -------------------- GLOBAL POPUP --------------------
function showGlobalPopup(msg, success = true) {
  if (!popup) return;
  popup.textContent = msg;
  popup.style.backgroundColor = success ? "#27ae60" : "#E74C3C";
  popup.style.display = "block";
  popup.style.opacity = "1";
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => (popup.style.display = "none"), 400);
  }, 3000);
}

// -------------------- GLOBAL POPUP (contact page) --------------------
function showGlobalPopup(msg, success = true) {
  if (!popup) return;
  popup.textContent = msg;
  popup.style.backgroundColor = success ? "#27ae60" : "#E74C3C";
  popup.style.display = "block";
  popup.style.opacity = "1";
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => (popup.style.display = "none"), 400);
  }, 3000);
}

// -------------------- SCROLL NAVIGATION --------------------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current)
      link.classList.add("active");
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// -------------------- DASHBOARD MESSAGES --------------------
async function loadMessages() {
  const grid = document.getElementById("messagesGrid");
  if (!grid) return;

  try {
    const res = await fetch("/api/messages");
    const messages = await res.json();
    grid.innerHTML = "";

    messages.forEach((msg) => {
      const card = document.createElement("div");
      card.className = "message-card";

      card.innerHTML = `
        <div class="message-info">
          <h3>${msg.name}</h3>
          <p class="email">${msg.email}</p>
          <p class="timestamp">${new Date(msg.created_at).toLocaleString()}</p>
          <p class="message-text">${msg.message}</p>
        </div>

        <div class="reply-section">
          <textarea class="reply-textarea" placeholder="Write your reply to ${msg.email}..." rows="3"></textarea>
          <div class="reply-actions">
            <button class="send-reply-btn">Send Reply</button>
            <span class="reply-status"></span>
          </div>
        </div>

        <button class="delete-btn" data-id="${msg.id}">Delete</button>
      `;

      // ---- Inline reply ----
      const textarea = card.querySelector(".reply-textarea");
      const sendBtn = card.querySelector(".send-reply-btn");
      const status = card.querySelector(".reply-status");

      sendBtn.addEventListener("click", async () => {
        const replyText = textarea.value.trim();
        if (!replyText) {
          status.textContent = "Please write a reply first.";
          status.style.color = "#E74C3C";
          return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
        status.textContent = "";

        try {
          const res = await fetch("/reply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: msg.email, reply: replyText }),
          });
          const text = await res.text();

          // Show success message inside the card
          status.textContent = text; // "Reply sent to X successfully"
          status.style.color = "#27ae60";
          textarea.value = "";
        } catch {
          status.textContent = "Failed to send reply.";
          status.style.color = "#E74C3C";
        } finally {
          sendBtn.disabled = false;
          sendBtn.textContent = "Send Reply";

          // Clear status after 4 seconds
          setTimeout(() => (status.textContent = ""), 4000);
        }
      });

      // ---- Delete ----
      card.querySelector(".delete-btn").addEventListener("click", async () => {
        const scrollY = window.scrollY;
        try {
          const res = await fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: msg.id }),
          });
          await res.text();
          card.remove(); // remove just this card, no full reload needed
        } catch {
          alert("Error deleting message");
        }
        window.scrollTo({ top: scrollY, behavior: "instant" });
      });

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Error loading messages.</p>";
    console.error(err);
  }
}

window.addEventListener("DOMContentLoaded", loadMessages);
