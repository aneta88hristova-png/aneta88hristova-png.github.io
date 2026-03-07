import { setupThemeToggle } from "./utils/theme.js";
import { FakerAPI } from "./api/FakerAPI.js";

let HomePage, ProfilePage, GalleryPage;

const sendToErrorTracking = (error, context = {}) => {
  console.error("Error occurred:", {
    error: error.message || error,
    stack: error.stack,
    context: context,
    timestamp: new Date().toISOString(),
  });

  return false;
};

const handleUnhandledRejection = (reason) => {
  console.error("Unhandled Promise Rejection:", reason);

  sendToErrorTracking(
    reason instanceof Error ? reason : new Error(String(reason)),
    {
      type: "unhandled_rejection",
    },
  );

  if (reason && reason.message && reason.message.includes("critical")) {
    showGlobalError("A critical error occurred. Please refresh the page.");
  }
};

async function initializeApp() {
  try {
    setupThemeToggle();

    if (typeof FakerAPI === "undefined") {
      showGlobalError("API library failed to load. Please refresh the page.");
      return;
    }

    try {
      const connected = await FakerAPI.testConnection();
      if (connected) {
        document.body.classList.add("api-connected");
      } else {
        document.body.classList.add("api-mock");
      }
    } catch (apiError) {
      document.body.classList.add("api-mock");
    }

    await loadPageController();
  } catch (error) {
    console.error("App initialization error:", error);
    showGlobalError("Failed to initialize application");
  }
}

async function loadPageController() {
  const path = window.location.pathname;
  const pageName = path.split("/").pop() || "index.html";

  try {
    if (pageName.includes("profile.html")) {
      await loadProfilePage();
    } else if (pageName.includes("gallery.html")) {
      await loadGalleryPage();
    } else {
      await loadHomePage();
    }
  } catch (error) {
    console.error("Page load error:", error);
    showPageError();
  }
}

async function loadHomePage() {
  try {
    const module = await import("./pages/HomePage.js");
    HomePage = module.HomePage;

    if (HomePage) {
      window.homePage = new HomePage();
      if (typeof window.homePage.init === "function") {
        await window.homePage.init();
      }
    }
  } catch (error) {
    console.error("Home page load error:", error);
    throw error;
  }
}

async function loadProfilePage() {
  try {
    const module = await import("./pages/ProfilePage.js");
    ProfilePage = module.ProfilePage;

    if (ProfilePage) {
      window.profilePage = new ProfilePage();
      if (typeof window.profilePage.init === "function") {
        await window.profilePage.init();
      }
    }
  } catch (error) {
    console.error("Profile page load error:", error);
    throw error;
  }
}

async function loadGalleryPage() {
  try {
    const module = await import("./pages/GalleryPage.js");
    GalleryPage = module.GalleryPage;

    if (GalleryPage) {
      window.galleryPage = new GalleryPage();
      if (typeof window.galleryPage.init === "function") {
        await window.galleryPage.init();
      }
    }
  } catch (error) {
    console.error("Gallery page load error:", error);
    throw error;
  }
}

function showGlobalError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.id = "global-error";
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #dc2626;
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 10000;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

  errorDiv.innerHTML = `
    <h3 style="margin-bottom: 10px;">⚠️ Application Error</h3>
    <p style="margin-bottom: 15px;">${message}</p>
    <button onclick="location.reload()" style="
      background: white;
      color: #dc2626;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    ">
      Refresh Page
    </button>
  `;

  document.body.appendChild(errorDiv);
}

function showPageError() {
  const loadingElement = document.getElementById("loading-indicator");
  const errorElement = document.getElementById("error-message");

  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  if (errorElement) {
    errorElement.style.display = "block";
  }

  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #f59e0b;
    color: white;
    padding: 10px 15px;
    border-radius: 6px;
    z-index: 10000;
  `;
  toast.textContent = "Failed to load page content";
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

window.addEventListener("error", function (event) {
  sendToErrorTracking(event.error);

  if (
    !document.getElementById("global-error") &&
    !event.error.message.includes("setupThemeToggle")
  ) {
    const errorMsg = event.error.message || "An unexpected error occurred";
    showGlobalError(`Error: ${errorMsg.substring(0, 100)}...`);
  }
});

window.addEventListener("unhandledrejection", function (event) {
  handleUnhandledRejection(event.reason);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

if (typeof window !== "undefined") {
  window.NexaNext = {
    version: "1.0.0",
    reload: () => window.location.reload(),
    clearCache: () => {
      if (FakerAPI && FakerAPI.clearCache) {
        FakerAPI.clearCache();
      }
    },
    getCurrentPage: () => {
      const path = window.location.pathname;
      if (path.includes("profile.html")) return "profile";
      if (path.includes("gallery.html")) return "gallery";
      return "home";
    },
    debug: {
      logError: sendToErrorTracking,
      showError: showGlobalError,
    },
  };
}

export { initializeApp, sendToErrorTracking, handleUnhandledRejection };
