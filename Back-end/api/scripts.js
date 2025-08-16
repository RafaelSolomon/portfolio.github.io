document.getElementById('year').textContent = new Date().getFullYear();

async function fadeInElement(el) {
  if (!el) return;
  el.classList.add('show');
}

async function updateAssets() {
  try {
    // Headshot
    const headshotRes = await fetch('/api/get-latest?type=headshot');
    const profilePhoto = document.getElementById('profile-photo');
    if (headshotRes.ok) {
      const { url } = await headshotRes.json();
      profilePhoto.onload = () => fadeInElement(profilePhoto);
      profilePhoto.src = url;
    } else {
      fadeInElement(profilePhoto);
    }

    // CV
    const cvRes = await fetch('/api/get-latest?type=cv');
    const cvLink = document.getElementById('cv-download-link');
    if (cvRes.ok) {
      const { url, latest_file } = await cvRes.json();
      cvLink.href = url;
      cvLink.setAttribute('download', latest_file);
      fadeInElement(cvLink);
    } else {
      fadeInElement(cvLink);
    }

    // Video
    const vidRes = await fetch('/api/get-latest?type=video');
    const introLink = document.getElementById('intro-video-link');
    if (vidRes.ok) {
      const { url } = await vidRes.json();
      introLink.href = url;
      fadeInElement(introLink);
    } else {
      fadeInElement(introLink);
    }
  } catch (err) {
    console.warn('Fallback assets applied', err);
    fadeInElement(document.getElementById('profile-photo'));
    fadeInElement(document.getElementById('cv-download-link'));
    fadeInElement(document.getElementById('intro-video-link'));
  }
}

updateAssets();
