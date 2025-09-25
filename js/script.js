const $ = (s) => document.querySelector(s);

// Greeting by time
(function setGreeting(){
  const h = new Date().getHours();
  let msg = "Welcome!";
  if (h < 12) msg = "Good morning!";
  else if (h < 18) msg = "Good afternoon!";
  else msg = "Good evening!";
  const el = $("#greeting");
  if (el) el.textContent = msg;
})();

// Current year
(function setYear(){
  const y = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = y;
})();

// Theme toggle
(function initTheme(){
  const root = document.documentElement;
  const key = "pref-theme";
  const saved = localStorage.getItem(key);
  if (saved === "dark") root.setAttribute("data-theme", "dark");
  const btn = $("#themeToggle");
  const setIcon = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☾" : "☼";
  };
  setIcon();
  btn.addEventListener("click", ()=>{
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem(key, isDark ? "light" : "dark");
    setIcon();
  });
})();

// Smooth scroll
(function smoothAnchors(){
  document.addEventListener("click",(e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute("href");
    if(!id || id.length < 2) return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
    history.pushState(null, "", id);
  });
})();

// Contact form handler
(function contactFormHandler(){
  const form = $("#contactForm");
  const status = $("#formStatus");
  if(!form) return;
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!form.checkValidity()){
      status.textContent = "Please fill in all required fields.";
      return;
    }
    const data = new FormData(form);
    const name = data.get("name") || "friend";
    status.textContent = `Thanks, ${name}! Your message was captured locally (demo only).`;
    form.reset();
  });
})();
