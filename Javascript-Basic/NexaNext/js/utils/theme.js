export function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) {
    return;
  }

  const currentTheme = localStorage.getItem("theme") || "light";

  document.body.setAttribute("data-theme", currentTheme);

  updateThemeButton(currentTheme);

  themeToggle.addEventListener("click", handleThemeToggle);

}

function handleThemeToggle(event) {
  event.preventDefault();

  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateThemeButton(newTheme);

  window.dispatchEvent(
    new CustomEvent("themeChanged", {
      detail: { theme: newTheme },
    }),
  );

}

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

export function getCurrentTheme() {
  return document.body.getAttribute("data-theme") || "light";
}

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


export function updateThemeToggleUI() {
  const currentTheme = getCurrentTheme();
  updateThemeButton(currentTheme);
}
