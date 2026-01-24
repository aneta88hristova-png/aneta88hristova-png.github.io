// js/main.js
import { HomePage } from "./pages/HomePage.js";

// Check what page we're on
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("index.html") || path === "/") {
    // Initialize Home Page
    if (typeof FakerAPI === "undefined") {

      document.getElementById("error-message").style.display = "block";
      return;
    }

    window.homePage = new HomePage();
    homePage.init();
  }

  // Add similar checks for profile.html and gallery.html
});
