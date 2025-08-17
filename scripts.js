document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.getElementById("profile-photo");
  const cvLink = document.getElementById("cv-download-link");
  const introVideoLink = document.getElementById("intro-video-link");
  const sections = document.querySelectorAll("section");
  const yearSpan = document.getElementById("year");

  // Set current year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Helper: fetch latest file
  async function fetchLatest(type) {
    try {
      const res = await fetch(`/api/get-latest?type=${type}`);
      if (!res.ok) throw new Error(`No latest ${type} found`);
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.warn(err.message);
      return null;
    }
  }

  // Load Headshot
  fetchLatest("headshot").then(url => {
    if (url && profileImg) {
      profileImg.src = url;
      profileImg.onload = () => {
        profileImg.classList.add("show");
        profileImg.classList.remove("hidden"); // ✅ Fix: reveal element
      };
    }
  });

  // Load CV
  fetchLatest("cv").then(url => {
    if (url && cvLink) {
      cvLink.href = url;
      cvLink.target = "_blank";
      cvLink.classList.add("show");
      cvLink.classList.remove("hidden"); // ✅ Fix
    }
  });

  // Load Intro Video
  fetchLatest("video").then(url => {
    if (url && introVideoLink) {
      introVideoLink.href = url;
      introVideoLink.classList.add("show");
      introVideoLink.classList.remove("hidden"); // ✅ Fix
    }
  });

  // Fade-in sections on scroll
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          entry.target.classList.remove("hidden"); // ✅ Fix
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(section => {
    observer.observe(section);

    // ✅ Ensure first-visible content isn't hidden if already in viewport
    if (section.getBoundingClientRect().top < window.innerHeight) {
      section.classList.add("show");
      section.classList.remove("hidden");
    }
  });
});
