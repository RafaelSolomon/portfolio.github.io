document.addEventListener("DOMContentLoaded", () => {
  // Set headshot image (served from public folder root)
  const headshot = document.getElementById("headshot");
  if (headshot) {
    headshot.src = "/headshot.png";
    headshot.style.display = "block"; // ensure visible
  }

  // Set CV download link (served from public folder root)
  const cvLink = document.getElementById("cv-link");
  if (cvLink) {
    cvLink.href = "/cv.pdf";
    cvLink.style.display = "inline-block"; // ensure visible
  }

  // Smooth scroll for nav links
  document.querySelectorAll("nav a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Fade-in sections on scroll
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
});
