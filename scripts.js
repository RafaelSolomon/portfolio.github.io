// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
  const assets = [
    { type: 'headshot', selector: '#headshot', fallback: 'Credentials/fallback-headshot.png' },
    { type: 'cv', selector: '#cv-download-link', fallback: 'Credentials/fallback-cv.pdf' },
    { type: 'video', selector: '#introVideo source', fallback: 'Credentials/fallback-video.mp4' }
  ];

  for (const asset of assets) {
    try {
      const res = await fetch(`/api/get-latest?type=${asset.type}`);
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();

      if (asset.type === 'headshot') {
        const el = document.querySelector(asset.selector);
        el.src = data.url || asset.fallback;
      }

      if (asset.type === 'cv') {
        const elPrimary = document.querySelector(asset.selector);
        const elSecondary = document.querySelector('#cv-download-link-secondary');
        const cvUrl = data.url || asset.fallback;
        if (elPrimary) elPrimary.href = cvUrl;
        if (elSecondary) elSecondary.href = cvUrl;
      }

      if (asset.type === 'video') {
        const el = document.querySelector(asset.selector);
        el.src = data.url || asset.fallback;
        const videoEl = el.parentElement;
        if (videoEl && videoEl.tagName === 'VIDEO') {
          videoEl.load(); // refresh video source
        }
      }

    } catch (err) {
      console.warn(`Failed to load ${asset.type}, using fallback`, err);
      if (asset.type === 'headshot') document.querySelector(asset.selector).src = asset.fallback;
      if (asset.type === 'cv') {
        document.querySelector(asset.selector).href = asset.fallback;
        document.querySelector('#cv-download-link-secondary').href = asset.fallback;
      }
      if (asset.type === 'video') {
        const el = document.querySelector(asset.selector);
        el.src = asset.fallback;
        el.parentElement.load();
      }
    }
  }

  // Fade-in animation
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach(el => el.classList.add('visible'));

  // Update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
