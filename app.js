/* Digital Income Hub: category data is deliberately separate so new categories can be added later. */
const categories = [
  { id: "ai-tools", icon: "✦", title: "AI tools & software", description: "Explore image, writing, design, productivity, and business tools.", countLabel: "Guides coming soon" },
  { id: "affiliate", icon: "↗", title: "Affiliate programs", description: "Learn how commissions, tracking, approval, and referrals work.", countLabel: "Guides coming soon" },
  { id: "tasks", icon: "▤", title: "Task & reward platforms", description: "Research microtasks, reward activities, and platform requirements.", countLabel: "Guides coming soon" },
  { id: "telegram-bots", icon: "➤", title: "Telegram bots", description: "Review useful bots carefully, including task bots and reward bots.", countLabel: "Verification required" },
  { id: "surveys", icon: "☷", title: "Survey sites", description: "Compare survey availability, screening, eligibility, and withdrawals.", countLabel: "Guides coming soon" },
  { id: "tutorials", icon: "▣", title: "Tutorials & comparisons", description: "Step-by-step walkthroughs, platform comparisons, and beginner guides.", countLabel: "Guides coming soon" }
];

const categoryGrid = document.querySelector("#category-grid");
if (categoryGrid) {
  categoryGrid.innerHTML = categories.map(category => `
    <article class="category-card" id="category-${escapeHTML(category.id)}">
      <span class="category-icon" aria-hidden="true">${escapeHTML(category.icon)}</span>
      <div>
        <h3>${escapeHTML(category.title)}</h3>
        <p>${escapeHTML(category.description)}</p>
        <span class="category-meta">${escapeHTML(category.countLabel)}</span>
      </div>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());
