document.addEventListener('DOMContentLoaded', async () => {
  const assets = [
    { type: 'headshot', selector: '#headshot', fallback: 'Credentials/fallback-headshot.png' },
    { type: 'cv', selector: '#cv-download-link', fallback: 'Credentials/fallback-cv.pdf' },
    { type: 'video', selector: '#introVideo source', fallback: 'Credentials/fallback-video.mp4' }
  ];

  const setAsset = (asset, url) => {
    const el = document.querySelector(asset.selector);
    if (!el) return;
    switch(asset.type){
      case 'headshot':
        el.src = url;
        break;
      case 'cv':
        document.querySelector(asset.selector)?.setAttribute('href', url);
        document.querySelector('#cv-download-link-secondary')?.setAttribute('href', url);
        break;
      case 'video':
        el.src = url;
        el.parentElement?.load();
        break;
    }
  }

  for(const asset of assets){
    try{
      const res = await fetch(`/api/get-latest?type=${asset.type}`);
      const data = res.ok ? await res.json() : null;
      setAsset(asset, data?.url || asset.fallback);
    }catch{
      setAsset(asset, asset.fallback);
    }
  }

  // Fade-in
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
});
