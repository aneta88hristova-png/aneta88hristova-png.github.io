// js/utils/theme.js

/**
 * Set up theme toggle button
 */
export function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) {
    return;
  }

  // Get current theme from localStorage or default to 'light'
  const currentTheme = localStorage.getItem("theme") || "light";

  // Apply theme to body
  document.body.setAttribute("data-theme", currentTheme);

  // Update button text
  updateThemeButton(currentTheme);

  // Add click event listener
  themeToggle.addEventListener("click", handleThemeToggle);

}

/**
 * Handle theme toggle click
 */
function handleThemeToggle(event) {
  event.preventDefault();

  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Update theme
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update button
  updateThemeButton(newTheme);

  // Dispatch event for other components
  window.dispatchEvent(
    new CustomEvent("themeChanged", {
      detail: { theme: newTheme },
    }),
  );

}

/**
 * Update theme button text and icon
 */
function updateThemeButton(theme) {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const themeIcon = themeToggle.querySelector(".theme-icon");
  const themeText = themeToggle.querySelector(".theme-text");

  if (theme === "dark") {
    if (themeIcon) themeIcon.textContent = "☀️";
    if (themeText) themeText.textContent = "Light Mode";
  } else {
    if (themeIcon) themeIcon.textContent = "🌙";
    if (themeText) themeText.textContent = "Dark Mode";
  }
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return document.body.getAttribute("data-theme") || "light";
}

/**
 * Set theme programmatically
 */
export function setTheme(theme) {
  if (theme === "light" || theme === "dark") {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeButton(theme);

    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme },
      }),
    );
  }
}

/**
 * Update theme toggle UI based on current theme
 * This function updates the button appearance without changing the theme
 * Useful when you want to sync the button UI after theme has been changed elsewhere
 */
export function updateThemeToggleUI() {
  const currentTheme = getCurrentTheme();
  updateThemeButton(currentTheme);
}
