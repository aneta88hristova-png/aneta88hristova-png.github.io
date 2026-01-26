export function showLoading() {
  const el = document.getElementById("loading-indicator");
  if (el) el.style.display = "flex";
}

export function hideLoading() {
  const el = document.getElementById("loading-indicator");
  if (el) el.style.display = "none";
}

export function showError() {
  const el = document.getElementById("error-message");
  if (el) el.style.display = "block";
}

export function hideError() {
  const el = document.getElementById("error-message");
  if (el) el.style.display = "none";
}

export function showContent(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = "block";
}

export function hideContent(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = "none";
}
