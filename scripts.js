// Fade-in on scroll
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  faders.forEach(el => observer.observe(el));
});

// Fetch latest asset dynamically (CV, headshot, video)
async function loadLatestAsset(type, selector, fallback) {
  try {
    const res = await fetch(`/api/get-latest?type=${type}`);
    if (!res.ok) throw new Error(`${type} not available`);
    const data = await res.json();

    const el = document.querySelector(selector);
    if (el) {
      if (el.tagName === "A") {
        el.href = data.url;
      } else if (el.tagName === "IMG") {
        el.src = data.url;
      } else if (el.tagName === "VIDEO") {
        el.src = data.url;
      }
    }
  } catch (err) {
    console.warn(`Fallback for ${type}:`, err.message);
    const el = document.querySelector(selector);
    if (el) {
      if (el.tagName === "A") {
        el.href = fallback;
      } else if (el.tagName === "IMG") {
        el.src = fallback;
      } else if (el.tagName === "VIDEO") {
        el.src = fallback;
      }
    }
  }
}

// Load assets with fallbacks
loadLatestAsset("cv", "a#downloadCV", "/Credentials/fallback-cv.pdf");
loadLatestAsset("headshot", "img#headshot", "/Credentials/fallback-headshot.png");
loadLatestAsset("video", "video#introVideo", "/Credentials/fallback-video.mp4");
