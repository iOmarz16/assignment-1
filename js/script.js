// Mini helpers
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const store = {
  get(k, d=null){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
};

// Theme toggle
(function initTheme(){
  const root = document.documentElement;
  const key = "pref-theme";
  const btn = $("#themeToggle");
  const saved = localStorage.getItem(key);
  if (saved === "dark") root.setAttribute("data-theme", "dark");
  const syncBtn = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☾" : "☼";
    btn.setAttribute("aria-pressed", String(isDark));
  };
  syncBtn();
  btn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem(key, isDark ? "light" : "dark");
    syncBtn();
  });
})();

// Greeting + remember name
(function greeting(){
  const hours = new Date().getHours();
  const base = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const savedName = store.get("username", "");
  $("#greeting").textContent = savedName ? `${base}, ${savedName}!` : `${base}!`;

  const form = $("#nameForm");
  const input = $("#nameInput");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    store.set("username", name);
    $("#greeting").textContent = `${base}, ${name}!`;
    input.value = "";
  });
})();

// Smooth scroll for in-page anchors
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (!id || id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", id);
});

// Footer year
$("#year").textContent = new Date().getFullYear();

// Projects data + simple filter/search
const projects = [
  { id: 1, title: 'Sales Dashboard', type: 'web', date: '2025-01-20', description: 'Monthly sales KPIs (Python, Power BI).' },
  { id: 2, title: 'Customer Churn Analysis', type: 'ml', date: '2025-02-12', description: 'EDA to identify churn factors.' },
  { id: 3, title: 'Responsive Portfolio Template', type: 'web', date: '2025-03-01', description: 'This website with JS interactivity.' }
];
const grid = $("#projectsGrid");
const filterSelect = $("#filterSelect");
const searchInput = $("#searchInput");
const emptyState = $("#emptyState");

function renderProjects(){
  const type = filterSelect?.value ?? "all";
  const term = (searchInput?.value ?? "").toLowerCase().trim();
  let list = projects.filter(p => type === "all" ? true : p.type === type);
  if (term) list = list.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  grid.innerHTML = "";
  if (list.length === 0) { emptyState.classList.remove("hidden"); return; }
  emptyState.classList.add("hidden");
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card fade";
    card.innerHTML = `
      <img src="https://placehold.co/1200x600/svg?text=${encodeURIComponent(p.title)}" alt="${p.title} preview">
      <div class="project-content">
        <h3>${p.title}</h3>
        <p class="muted">${p.type.toUpperCase()} • ${new Date(p.date).toLocaleDateString()}</p>
        <p>${p.description}</p>
      </div>`;
    grid.appendChild(card);
    requestAnimationFrame(() => card.classList.add("show"));
  });
}
filterSelect?.addEventListener("input", renderProjects);
searchInput?.addEventListener("input", renderProjects);
renderProjects();

// Public API fetch (loading/error/retry)
const loadBtn = $("#loadFact");
const factText = $("#factText");
const factErr = $("#factError");
const retryBtn = $("#retryBtn");
const loader = document.querySelector(".loading");

async function loadFact(){
  loader.classList.remove("hidden");
  factErr.classList.add("hidden");
  factText.textContent = "";
  factText.classList.remove("show");
  try {
    const res = await fetch("https://catfact.ninja/fact");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    factText.textContent = data.fact || "Here is a random cat fact!";
    factText.classList.add("show");
  } catch (e) {
    factErr.classList.remove("hidden");
  } finally {
    loader.classList.add("hidden");
  }
}
loadBtn?.addEventListener("click", loadFact);
retryBtn?.addEventListener("click", loadFact);

// Contact form validation + AI Draft
const contactForm = $("#contactForm");
const formStatus = $("#formStatus");
function setFieldError(input, msg){
  const field = input.closest(".field");
  field.querySelector(".error-msg").textContent = msg || "";
  input.setAttribute("aria-invalid", msg ? "true" : "false");
}
function validateContact(){
  const name = contactForm.elements["name"];
  const email = contactForm.elements["email"];
  const message = contactForm.elements["message"];
  setFieldError(name,""); setFieldError(email,""); setFieldError(message,"");
  let ok = true;
  if (!name.value.trim()) { setFieldError(name, "Name is required"); ok = false; }
  const emailVal = email.value.trim();
  if (!emailVal) { setFieldError(email, "Email is required"); ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setFieldError(email, "Invalid email"); ok = false; }
  if (!message.value.trim() || message.value.trim().length < 10) { setFieldError(message, "Message must be at least 10 characters"); ok = false; }
  return ok;
}
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.textContent = "";
  if (!validateContact()){
    formStatus.textContent = "Please correct the highlighted fields.";
    formStatus.classList.add("error");
    return;
  }
  formStatus.classList.remove("error");
  const name = contactForm.elements["name"].value.trim() || "friend";
  formStatus.textContent = `✅ Thanks, ${name}! Your message was captured locally (demo only).`;
  contactForm.reset();
});

// AI Draft button (AI enhancement)
$("#aiDraftBtn")?.addEventListener("click", () => {
  const savedName = store.get("username", "there");
  const template =
    `Hi, I'm ${savedName}. I'm interested in collaborating on a data project about {TOPIC}.` +
    ` My background: {YOUR_SKILLS}. Could we schedule a short call next week?`;
  contactForm.elements["message"].value = template;
  contactForm.elements["message"].focus();
});
