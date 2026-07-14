const header = document.getElementById("siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const pageLoader = document.getElementById("pageLoader");

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    pageLoader?.classList.add("is-done");
    document.body.classList.remove("is-loading");
  }, 2000);
});

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  header?.classList.toggle("menu-active", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
}

menuToggle?.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("menu-open"));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) setMenu(false);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const countdown = document.querySelector("[data-countdown]");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const remaining = Math.max(target - Date.now(), 0);
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.querySelector("[data-days]").textContent = String(days).padStart(3, "0");
  countdown.querySelector("[data-hours]").textContent = pad(hours);
  countdown.querySelector("[data-minutes]").textContent = pad(minutes);
  countdown.querySelector("[data-seconds]").textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const numberFormatter = new Intl.NumberFormat("en-IN");

function animateNumber(element) {
  const target = Number(element.dataset.count || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${numberFormatter.format(Math.round(target * eased))}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll(".stat-number").forEach((element) => statObserver.observe(element));

document.querySelectorAll(".nomination-card").forEach((card) => {
  const categoryId = card.dataset.categoryId;
  const startCount = Number(card.dataset.startCount || 0);
  const counter = card.querySelector("[data-nomination-count]");
  const button = card.querySelector(".nomination-button");
  const storageKey = `mieca-2026-nominations-${categoryId}`;
  const savedCount = Number(localStorage.getItem(storageKey) || startCount);

  if (counter) counter.textContent = numberFormatter.format(savedCount);

  button?.addEventListener("click", () => {
    const current = Number(localStorage.getItem(storageKey) || startCount);
    const next = current + 1;
    localStorage.setItem(storageKey, String(next));
    if (counter) counter.textContent = numberFormatter.format(next);
    button.textContent = "Nomination Added";
    window.setTimeout(() => {
      button.textContent = "Nominate Now";
    }, 1200);
  });
});
