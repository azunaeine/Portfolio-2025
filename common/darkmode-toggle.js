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

// Use event delegation to handle dynamically loaded toggle buttons
document.addEventListener("click", (event) => {
  if (event.target.closest(".theme-toggle")) {
    toggleTheme();
  }
});

// on page load, check local storage for saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // if no theme is saved, use the default (light)
  setTheme("light");
}
