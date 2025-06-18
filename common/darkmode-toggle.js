const themeToggle = document.querySelectorAll("#themeToggle");
const doc = document.documentElement;

const setTheme = (theme) => {
  doc.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  const currentTheme = doc.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};

themeToggle.forEach((btn) => btn.addEventListener("click", toggleTheme));
