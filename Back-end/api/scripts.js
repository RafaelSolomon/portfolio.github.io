document.getElementById('year').textContent = new Date().getFullYear();

async function updateAssets() {
  // Show fallback headshot immediately
  const profilePhoto = document.getElementById("profile-photo");
  profilePhoto.classList.add("show");

  try {
    // CV
    const cvRes = await fetch("/api/get-latest?type=cv");
    const cvLink = document.getElementById("cv-download-link");
    if (cvRes.ok) {
      const { url, latest_file } = await cvRes.json();
      if (url) {
        cvLink.href = url;
        cvLink.setAttribute("download", latest_file);
        cvLink.classList.add("show");
      }
    }

    // Headshot
    const hsRes = await fetch("/api/get-latest?type=headshot");
    if (hsRes.ok) {
      const { url } = await hsRes.json();
      if (url) {
        profilePhoto.src = url;
        profilePhoto.classList.add("show");
      }
    }

    // Video
    const vidRes = await fetch("/api/get-latest?type=video");
    const introLink = document.getElementById("intro-video-link");
    if (vidRes.ok) {
      const { url } = await vidRes.json();
      if (url) {
        introLink.href = url;
        introLink.classList.add("show");
      }
    }

  } catch (err) {
    console.warn("Using fallback assets:", err);
  }
}

updateAssets();
document.getElementById("profile-photo").addEventListener("error", function() {
  this.src = "/assets/fallback-headshot.jpg"; // Fallback headshot
});
