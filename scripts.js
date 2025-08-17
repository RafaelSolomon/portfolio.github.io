// ==============================
// Smooth fade-in animation on scroll
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-in elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Auto-update footer year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Dynamic latest assets fetch (if get-latest API available)
  const fetchAsset = async (type, targetId) => {
    try {
      const res = await fetch(`/api/get-latest?type=${type}`);
      if(!res.ok) throw new Error('Fetch failed');
      const url = await res.text();
      const el = document.getElementById(targetId);
      if(el) el.src = url;
    } catch(e) {
      console.warn(`Could not fetch latest ${type}:`, e);
    }
  };

  fetchAsset('headshot', 'headshot');
  fetchAsset('cv', 'cv-download-link');
  fetchAsset('video', 'introVideo');
});
