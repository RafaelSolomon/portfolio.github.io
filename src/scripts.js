document.addEventListener("DOMContentLoaded", () => {
  // Ensure headshot is displayed
  const headshot = document.getElementById("headshot");
  if (headshot) headshot.src = "/public/headshot.png";

  // Ensure CV link works
  const cvLink = document.getElementById("cv-link");
  if (cvLink) cvLink.href = "/public/cv.pdf";

  // Smooth scroll for nav links
  document.querySelectorAll("nav a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Fade-in sections
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
});
