// Project data
const projects = [
  {
    title: "Lo-QOS",
    description:
      "A revolutionary operating system integrating quantum computing, AI, and blockchain.",
    icon: "fas fa-atom",
    url: "https://abdevndesign.com/lo-qos",
  },
  {
    title: "Zero Knowledge Proofs",
    description:
      "Explore blockchain privacy solutions and advanced cryptographic techniques.",
    icon: "fas fa-shield-alt",
    url: "https://abdevndesign.com/ZKPsAB",
  },
 
];

// Load projects dynamically
document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById("projectsGrid");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <div class="project-image">
        <i class="${project.icon}"></i>
      </div>
      <div class="project-content">
        <h2 class="project-title">${project.title}</h2>
        <p class="project-description">${project.description}</p>
        <a href="${project.url}" target="_blank" rel="noopener" class="project-link">
          View Project
        </a>
      </div>
    `;

    projectsGrid.appendChild(card);
  });
});
