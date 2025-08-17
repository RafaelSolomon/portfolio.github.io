// Update year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// Fade-in sections on load (simple: show all once DOM is ready)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in, section").forEach(el => {
    el.classList.add("show");
  });
});

// Fetch helper
async function fetchLatest(type) {
  try {
    const res = await fetch(`/api/get-latest?type=${type}`);
    if (!res.ok) throw new Error(`Failed to fetch ${type}`);
    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.warn(`Using fallback for ${type}:`, err.message);
    return null;
  }
}

// Load latest headshot
document.addEventListener("DOMContentLoaded", async () => {
  const img = document.getElementById("headshot");
  const url = await fetchLatest("headshot");
  if (img && url) {
    img.src = url;
    img.classList.add("show");
  }
});

// Load latest CV (both hero button and CV section button)
document.addEventListener("DOMContentLoaded", async () => {
  const links = [
    document.getElementById("cv-download-link"),
    document.getElementById("cv-download-link-secondary"),
  ].filter(Boolean);

  const url = await fetchLatest("cv");
  if (url) {
    links.forEach(link => {
      link.href = url;
      link.target = "_blank";
      link.setAttribute("download", "");
    });
  }
});

// Load latest video
document.addEventListener("DOMContentLoaded", async () => {
  const videoEl = document.getElementById("introVideo");
  if (!videoEl) return;
  const sourceEl = videoEl.querySelector("source");
  const url = await fetchLatest("video");
  if (url && sourceEl) {
    sourceEl.src = url;
    videoEl.load();
  }
});
