// ----------------------
// CV & Headshot Loader
// ----------------------
async function loadCV() {
  try {
    const res = await fetch("/api/get-latest?type=cv");
    const data = await res.json();
    const cvLink = document.getElementById("cv-link");
    if (cvLink && data.url) {
      cvLink.href = data.url;
      cvLink.style.display = "inline"; // make visible
    }
  } catch (err) {
    console.error("Failed to load CV:", err);
  }
}

async function loadHeadshot() {
  try {
    const res = await fetch("/api/get-latest?type=headshot");
    const data = await res.json();
    const headshot = document.getElementById("headshot");
    if (headshot && data.url) {
      headshot.src = data.url;
      headshot.style.display = "block"; // make visible
    }
  } catch (err) {
    console.error("Failed to load headshot:", err);
  }
}

// ----------------------
// Page Init
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  // Load dynamic assets
  loadCV();
  loadHeadshot();

  // If you already had other DOMContentLoaded code (menus, animations, etc.),
  // keep it here. Example:
  // initNavbar();
  // initAnimations();
});
