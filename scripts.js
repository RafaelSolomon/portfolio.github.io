// scripts.js

document.addEventListener("DOMContentLoaded", async () => {
  // Fade-in helper
  const fadeIn = (el) => {
    if (!el) return;
    el.classList.add("visible");
  };

  // Update year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Fetch latest asset from API
  const fetchLatest = async (type) => {
    try {
      const res = await fetch(`/api/get-latest?type=${type}`);
      if (!res.ok) throw new Error(`${type} not found`);
      return await res.json();
    } catch (err) {
      console.warn(`Failed to load ${type}:`, err.message);
      return null;
    }
  };

  // Update headshot
  const headshotEl = document.getElementById("headshot");
  const headshotData = await fetchLatest("headshot");
  if (headshotData && headshotEl) {
    headshotEl.src = headshotData.url;
    fadeIn(headshotEl);
  } else {
    fadeIn(headshotEl); // fallback already in HTML
  }

  // Update CV links
  const cvLinks = [
    document.getElementById("cv-download-link"),
    document.getElementById("cv-download-link-secondary"),
  ];
  const cvData = await fetchLatest("cv");
  if (cvData) {
    cvLinks.forEach((link) => {
      if (link) {
        link.href = cvData.url;
        fadeIn(link);
      }
    });
  } else {
    cvLinks.forEach((link) => fadeIn(link)); // fallback
  }

  // Update intro video
  const videoEl = document.getElementById("introVideo");
  const videoData = await fetchLatest("video");
  if (videoData && videoEl) {
    const sourceEl = videoEl.querySelector("source");
    if (sourceEl) sourceEl.src = videoData.url;
    videoEl.load();
    fadeIn(videoEl);
  } else if (videoEl) {
    fadeIn(videoEl); // fallback
  }

  // Fade-in nav and sections
  document.querySelectorAll(".fade-in").forEach((el) => fadeIn(el));
});
