const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

themeToggle.addEventListener("click", () => {
  // Check current theme
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
