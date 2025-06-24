const themeToggles = document.querySelectorAll(".theme-toggle");
const body = document.querySelector("body");

const setTheme = (theme) => {
  body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
};

themeToggles.forEach((btn) => btn.addEventListener("click", toggleTheme));

// on page load, check local storage for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // if no theme is saved, use the default (light)
  setTheme("light");
}
