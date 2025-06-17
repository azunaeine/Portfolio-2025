// Simple theme toggle functionality
function toggleTheme() {
  console.log("Theme toggle clicked");
  const body = document.body;
  console.log(
    "Current theme:",
    body.classList.contains("dark-theme") ? "dark" : "light"
  );

  body.classList.toggle("dark-theme");

  // Update the theme toggle button icon
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    if (body.classList.contains("dark-theme")) {
      console.log("Switching to dark theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      console.log("Switching to light theme");
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing theme toggle");
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    console.log("Theme toggle button found");
    themeToggle.addEventListener("click", toggleTheme);
    // Set initial icon
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    console.log("Theme toggle button not found");
  }
});
