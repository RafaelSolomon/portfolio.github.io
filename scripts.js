document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // Fade-in animation on scroll
  // ==============================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ==============================
  // Auto-update footer year
  // ==============================
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // ==============================
  // Fetch latest assets dynamically
  // ==============================
  const fetchAsset = async (type, targetId) => {
    try {
      const res = await fetch(`/api/get-latest?type=${type}`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      const el = document.getElementById(targetId);

      if (el) {
        if (el.tagName === "A") {
          el.href = data.url; // For links
        } else {
          el.src = data.url; // For images/videos
        }
      }
    } catch (e) {
      console.warn(`Could not fetch latest ${type}:`, e);
    }
  };

  fetchAsset("headshot", "headshot");
  fetchAsset("cv", "cv-download-link");
  fetchAsset("video", "introVideo");
});
