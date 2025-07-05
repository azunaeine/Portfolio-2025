// Load hamburger menu content
fetch("../common/hamburger-menu.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("hamburger-menu-container").innerHTML = html;
    // Load the scripts after the HTML is inserted
    const script1 = document.createElement("script");
    script1.src = "../common/hamburger-menu.js";
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "../common/darkmode-toggle.js";
    document.body.appendChild(script2);
  })
  .catch((error) => console.error("Error loading hamburger menu:", error));
