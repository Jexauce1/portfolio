// ==========================================================================
// SAM — Portfolio | main.js
// ==========================================================================
document.documentElement.classList.add('js');

const LANG_KEY = 'portfolio-lang';
const DEFAULT_LANG = 'fr';

function getLang() {
  const saved = localStorage.getItem(LANG_KEY);
  return I18N[saved] ? saved : DEFAULT_LANG;
}

function t(key, lang) {
  return (I18N[lang] && I18N[lang][key]) || (I18N[DEFAULT_LANG] && I18N[DEFAULT_LANG][key]) || '';
}

function applyLanguage(lang) {
  if (!I18N[lang]) lang = DEFAULT_LANG;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = t(key, lang);
    if (!value) return;
    if (el.dataset.i18nHtml === 'true') el.innerHTML = value;
    else el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const value = t(key, lang);
    if (value) el.placeholder = value;
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    const value = t(key, lang);
    if (value) el.alt = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    const value = t(key, lang);
    if (value) el.setAttribute('aria-label', value);
  });

  const page = document.body.dataset.page;
  if (page && I18N_PAGES[page]) {
    document.title = t(I18N_PAGES[page].titleKey, lang);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t(I18N_PAGES[page].descKey, lang);
  }

  updateLangSwitcherUI(lang);
}

function updateLangSwitcherUI(lang) {
  const other = lang === 'fr' ? 'en' : 'fr';
  const label = lang.toUpperCase();

  document.querySelectorAll('.lang-switch').forEach((switcher) => {
    const btn = switcher.querySelector(':scope > button');
    const option = switcher.querySelector('.lang-dropdown button');
    if (btn) {
      const current = btn.querySelector('.lang-current');
      if (current) current.textContent = label;
      btn.setAttribute('aria-label', `${t('common.langSwitch', lang)} (${label})`);
    }
    if (option) {
      option.textContent = other.toUpperCase();
      option.dataset.lang = other;
    }
  });

  document.querySelectorAll('.lang-line').forEach((line) => {
    line.textContent = `${label} ▾`;
    line.dataset.lang = lang;
  });
}

function setLanguage(lang) {
  applyLanguage(lang);
  document.querySelectorAll('.lang-switch.open').forEach((s) => s.classList.remove('open'));
}

/* ---------- Burger / mobile menu ---------- */
const burgerBtn = document.querySelector('.burger-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-menu-close');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', openMobileMenu);
  mobileClose && mobileClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', closeMobileMenu));
}

/* ---------- Language switcher ---------- */
document.querySelectorAll('.lang-switch').forEach((switcher) => {
  const btn = switcher.querySelector(':scope > button');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });
  switcher.querySelectorAll('.lang-dropdown button').forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(option.dataset.lang || (getLang() === 'fr' ? 'en' : 'fr'));
    });
  });
});

document.querySelectorAll('.lang-line').forEach((line) => {
  line.setAttribute('role', 'button');
  line.setAttribute('tabindex', '0');
  line.addEventListener('click', () => {
    setLanguage(getLang() === 'fr' ? 'en' : 'fr');
  });
  line.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLanguage(getLang() === 'fr' ? 'en' : 'fr');
    }
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.lang-switch.open').forEach((s) => s.classList.remove('open'));
});

/* ---------- Contact form demo alert ---------- */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(t('contacts.form.alert', getLang()));
  });
}

/* ---------- Generate dot-grid decorations ---------- */
function buildDots(el) {
  const cols = el.classList.contains('dots--sm') ? 3 : 5;
  const rows = el.classList.contains('dots--sm') ? 3 : 4;
  el.innerHTML = '';
  for (let i = 0; i < cols * rows; i++) {
    const span = document.createElement('span');
    el.appendChild(span);
  }
}
document.querySelectorAll('.dots').forEach(buildDots);

/* ---------- Init language + GSAP ---------- */
window.addEventListener('DOMContentLoaded', () => {
  applyLanguage(getLang());

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
        delay: (i % 3) * 0.05,
      });
    });

    gsap.from('.hero-title, .hero-sub, .hero .btn, .status-badge', {
      opacity: 0,
      y: 18,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    });
  } else {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
});
