// Optional: Add filtering functionality
document.addEventListener("DOMContentLoaded", () => {
  // Example project data
  const projects = [
    {
      title: "Project Name 1",
      category: "Web Development",
      description:
        "Brief description of the project and the technologies used.",
      image: "/api/placeholder/600/400",
      link: "#",
    },
    // Add more projects here
  ];

  // Function to create project elements
  function createProjectElement(project) {
    const article = document.createElement("article");
    article.className = "portfolio-item";

    article.innerHTML = `
            <div class="portfolio-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="portfolio-overlay">
                    <div class="portfolio-overlay-content">
                        <h3>${project.title}</h3>
                        <p>${project.category}</p>
                        <a href="${project.link}" class="portfolio-button">View Project</a>
                    </div>
                </div>
            </div>
            <div class="portfolio-content">
                <h3>${project.title}</h3>
                <p class="portfolio-category">${project.category}</p>
                <p class="portfolio-description">${project.description}</p>
            </div>
        `;

    return article;
  }

  // Populate portfolio grid
  const portfolioGrid = document.querySelector(".portfolio-grid");
  projects.forEach((project) => {
    portfolioGrid.appendChild(createProjectElement(project));
  });

  // Optional: Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".portfolio-item").forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "all 0.6s ease";
    observer.observe(item);
  });
});
