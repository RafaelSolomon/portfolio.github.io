const DEFAULT_HEADSHOT = "/Credentials/portfolio-headshot.png";
const DEFAULT_CV = "/Credentials/cv.pdf";

// Fetch latest files from API
async function fetchLatest(type) {
  try {
    const response = await fetch("/api/get-latest");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    if (type === "headshot") return data.headshot || DEFAULT_HEADSHOT;
    if (type === "cv") return data.cv || DEFAULT_CV;
    if (type === "json") return data.json || null;

    return data;
  } catch (error) {
    console.error("Fetch latest failed:", error);
    if (type === "headshot") return DEFAULT_HEADSHOT;
    if (type === "cv") return DEFAULT_CV;
    return null;
  }
}

// Populate headshot and CV link on page load
document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.getElementById("profile-photo");
  const cvLink = document.getElementById("cv-download");

  if (profileImg) {
    const headshotURL = await fetchLatest("headshot");
    profileImg.src = headshotURL;
  }

  if (cvLink) {
    const cvURL = await fetchLatest("cv");
    cvLink.href = cvURL;
  }
});
