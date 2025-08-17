// scripts.js
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Fix headshot ID mismatch
  const profileImg = document.getElementById("headshot");
  const cvLink = document.getElementById("cv-download-link");

  // Fade-in sections on load
  document.querySelectorAll("section").forEach(section => {
    section.classList.add("show");
    section.classList.remove("hidden");
  });

  // Fetch helper
  const fetchLatest = async (type) => {
    try {
      const res = await fetch(`/api/get-latest?type=${type}`);
      if (!res.ok) throw new Error(`Failed to fetch ${type}`);
      const data = await res.json();
      return data.url || null;
    } catch (err) {
      console.error("Error fetching latest:", err);
      return null;
    }
  };

  // Load latest profile image
  fetchLatest("headshot").then(url => {
    if (url && profileImg) {
      profileImg.src = url;
      profileImg.classList.add("show");
      profileImg.classList.remove("hidden");
    }
  });

  // Load latest CV
  fetchLatest("cv").then(url => {
    if (url && cvLink) {
      cvLink.href = url;
      cvLink.target = "_blank";
      cvLink.setAttribute("download", "Jan_Angelo_Bacucang_CV.pdf");
      cvLink.classList.add("show");
      cvLink.classList.remove("hidden");
    }
  });
});
