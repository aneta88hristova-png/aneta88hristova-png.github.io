import { HomePage } from "./pages/HomePage.js";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("index.html") || path === "/") {
    if (typeof FakerAPI === "undefined") {

      document.getElementById("error-message").style.display = "block";
      return;
    }

    window.homePage = new HomePage();
    homePage.init();
  }

});
