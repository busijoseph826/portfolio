(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme");
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const typed = document.getElementById("typed");
  const form = document.getElementById("form");
  const message = document.getElementById("msg");

  // Theme preference: start dark, remember the visitor's choice when storage is available.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("joseph-portfolio-theme"); } catch (_) {}
  if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
  updateThemeButton();

  function updateThemeButton() {
    const light = root.dataset.theme === "light";
    themeButton.textContent = light ? "☾" : "☼";
    themeButton.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeButton.title = light ? "Switch to dark theme" : "Switch to light theme";
  }

  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("joseph-portfolio-theme", root.dataset.theme); } catch (_) {}
    updateThemeButton();
  });

  // Mobile navigation.
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navLinks.classList.toggle("open", open);
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    }
  });

  // Typing animation with reduced-motion support.
  const roles = ["Backend Engineer", "Java & Spring Boot Developer", "Microservices Enthusiast"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typed && !reduceMotion) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      const role = roles[roleIndex];
      typed.textContent = role.slice(0, charIndex);
      if (!deleting && charIndex < role.length) charIndex++;
      else if (!deleting) {
        deleting = true;
        window.setTimeout(tick, 1250);
        return;
      } else if (charIndex > 0) charIndex--;
      else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      window.setTimeout(tick, deleting ? 35 : 75);
    }
    window.setTimeout(tick, 400);
  }

  // Project category filters.
  const filterButtons = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".project-card[data-c]");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.f;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(card => {
      const categories = card.dataset.c.split(/\s+/);
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  }));

  // Reveal sections as they enter the viewport; show them all if unsupported.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("show"));
  }

  // No server is configured: prepare an email draft instead of pretending to send.
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const body = String(data.get("message") || "").trim();
    const recipient = "you@example.com"; // Replace with your real email before publishing.
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const mailBody = encodeURIComponent(`${body}\n\nFrom: ${name}\nEmail: ${email}`);
    message.textContent = "Opening your email app with a draft. Replace the placeholder email address in index.html and script.js before publishing.";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${mailBody}`;
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
