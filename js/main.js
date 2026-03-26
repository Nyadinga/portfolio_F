// ==========================
// THEME TOGGLE
// ==========================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

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

// ==========================
// FORM VALIDATION
// ==========================
const form = document.getElementById("formContact");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let hasError = false;

  // Clear previous errors
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => (el.textContent = ""));

  // Name validation
  const name = document.getElementById("name").value.trim();
  if (name === "") {
    document.getElementById("nameError").textContent = "Name is required.";
    hasError = true;
  }

  // Email validation
  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    document.getElementById("emailError").textContent = "Email is required.";
    hasError = true;
  } else if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Invalid email format.";
    hasError = true;
  }

  // Message validation
  const message = document.getElementById("message").value.trim();
  if (message === "") {
    document.getElementById("messageError").textContent =
      "Message is required.";
    hasError = true;
  }

  // Submit if no errors
  if (!hasError) {
    alert("Form submitted successfully!");
    form.submit(); // keep if using Formspree
  }
});

// ==========================
// SCROLL SPY (ACTIVE NAV)
// ==========================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    // Section is considered active when it's near middle of screen
    if (rect.top <= 150 && rect.bottom >= 150) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ==========================
// CLICK ACTIVE (OPTIONAL UX)
// ==========================
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

document.getElementById("formContact").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch("/contact", {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  alert(text);
});
