// scripts.js
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Fade-in on scroll
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
  );
  faders.forEach(el => observer.observe(el));

  // Helper to fetch latest asset URL
  async function fetchLatest(type) {
    try {
      const res = await fetch(`/api/get-latest?type=${encodeURIComponent(type)}`);
      if (!res.ok) throw new Error(`${type} fetch failed (${res.status})`);
      const data = await res.json();
      return data?.url || null;
    } catch (err) {
      console.warn(`Using fallback for ${type}:`, err.message);
      return null;
    }
  }

  // HEADSHOT
  (async () => {
    const img = document.getElementById("headshot");
    if (!img) return;
    img.onerror = () => {
      // graceful fallback
      img.src = "Credentials/fallback-headshot.png";
    };
    const url = await fetchLatest("headshot");
    if (url) img.src = url;
  })();

  // CV (both buttons)
  (async () => {
    const links = [
      document.getElementById("cv-download-link"),
      document.getElementById("cv-download-link-secondary")
    ].filter(Boolean);

    const url = await fetchLatest("cv");
    if (url && links.length) {
      links.forEach(link => {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        // let browser name the file naturally; add this to force download name if you want:
        // link.setAttribute("download", "Jan_Angelo_Bacucang_CV.pdf");
      });
    }
  })();

  // VIDEO
  (async () => {
    const videoEl = document.getElementById("introVideo");
    if (!videoEl) return;
    const sourceEl = videoEl.querySelector("source");
    const url = await fetchLatest("video");
    if (url && sourceEl) {
      sourceEl.src = url;
      // reload sources
      videoEl.load();
    }
  })();
});
