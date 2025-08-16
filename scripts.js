document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.getElementById("profile-photo");
  const cvLink = document.getElementById("cv-link");
  const introVideo = document.getElementById("intro-video");

  const DEFAULT_HEADSHOT = "/Credentials/portfolio-headshot.png";
  const DEFAULT_CV = "/Credentials/cv.pdf";

  try {
    const res = await fetch("/api/get-latest");
    if (!res.ok) throw new Error("API fetch failed");

    const data = await res.json();
    console.log("Data fetched from API:", data);

    profileImg.src = data.headshot || DEFAULT_HEADSHOT;
    cvLink.href = data.cv || DEFAULT_CV;

    if (introVideo && data.video) {
      introVideo.src = data.video;
      introVideo.load();
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic data:", err);
    profileImg.src = DEFAULT_HEADSHOT;
    cvLink.href = DEFAULT_CV;
  }
});
