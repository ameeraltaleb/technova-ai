// ============================================
// TechNova AI — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initSearch();
  initMobileMenu();
  initBackToTop();
  initNewsletter();
  initReadingProgress();
  initScrollAnimations();
});

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================
// THEME TOGGLE
// ============================================
function initTheme() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;

  const saved = localStorage.getItem('technova-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(btn, saved);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('technova-theme', next);
    updateThemeIcon(btn, next);
  });
}

function updateThemeIcon(btn, theme) {
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// SEARCH
// ============================================
function initSearch() {
  const modal = document.getElementById('searchModal');
  const searchBtn = document.getElementById('searchBtn');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const heroSearch = document.getElementById('heroSearch');
  const heroSearchBtn = document.getElementById('heroSearchBtn');

  if (!modal) return;

  function openSearch() {
    modal.classList.add('active');
    setTimeout(() => input && input.focus(), 100);
  }

  function closeSearch() {
    modal.classList.remove('active');
    if (input) input.value = '';
    if (results) results.innerHTML = '<div class="search-modal__empty">Type to search across all articles and reviews...</div>';
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  if (input) {
    input.addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length < 2) {
        results.innerHTML = '<div class="search-modal__empty">Type to search across all articles and reviews...</div>';
        return;
      }

      const found = searchArticles(query);
      if (found.length === 0) {
        results.innerHTML = `<div class="search-modal__empty">No results found for "${query}"</div>`;
        return;
      }

      results.innerHTML = found.map(a => {
        const cat = getCategoryById(a.category);
        return `
          <div class="search-modal__result" onclick="navigateToArticle('${a.id}')">
            <div class="search-modal__result-icon">${cat ? cat.icon : '📄'}</div>
            <div>
              <div class="search-modal__result-title">${highlightMatch(a.title, query)}</div>
              <div class="search-modal__result-cat">${cat ? cat.name : ''} · ${a.readTime}</div>
            </div>
          </div>
        `;
      }).join('');
    });
  }

  // Hero search
  if (heroSearch) {
    heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openSearch();
        setTimeout(() => {
          if (input) {
            input.value = heroSearch.value;
            input.dispatchEvent(new Event('input'));
          }
        }, 150);
      }
    });
  }

  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      openSearch();
      setTimeout(() => {
        if (input && heroSearch) {
          input.value = heroSearch.value;
          input.dispatchEvent(new Event('input'));
        }
      }, 150);
    });
  }
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<strong style="color:var(--color-accent)">$1</strong>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => menu.classList.add('active'));
  if (close) close.addEventListener('click', () => menu.classList.remove('active'));

  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('active'));
  });
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// NEWSLETTER
// ============================================
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    if (email) {
      showToast('🎉 Thanks for subscribing! Check your inbox.');
      form.reset();
    }
  });
}

// ============================================
// READING PROGRESS
// ============================================
function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.card, .category-card, .newsletter, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ============================================
// TABLE OF CONTENTS (for article pages)
// ============================================
function initTableOfContents() {
  const content = document.querySelector('.article-content');
  const toc = document.querySelector('.toc__list');
  if (!content || !toc) return;

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'section-' + i;
    const link = document.createElement('a');
    link.href = '#' + h.id;
    link.className = 'toc__link' + (h.tagName === 'H3' ? ' toc__link--h3' : '');
    link.textContent = h.textContent;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    toc.appendChild(link);
  });

  // Active state on scroll
  const tocLinks = toc.querySelectorAll('.toc__link');
  window.addEventListener('scroll', () => {
    let current = '';
    headings.forEach(h => {
      if (window.pageYOffset >= h.offsetTop - 120) {
        current = h.id;
      }
    });
    tocLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// SHARE
// ============================================
function shareArticle(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const urls = {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  };

  if (platform === 'copy') {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('📋 Link copied to clipboard!');
    });
    return;
  }

  if (urls[platform]) {
    window.open(urls[platform], '_blank', 'width=600,height=400');
  }
}
