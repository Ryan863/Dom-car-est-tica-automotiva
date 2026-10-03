/**
 * DOM'CAR ESTÉTICA AUTOMOTIVA - MAIN ENGINE
 * Navigation, Scroll reveals, Clipboard copying, Toast engine & GSAP integration
 */

// Global Toast Engine
window.showToast = function(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);
  } else {
    toast.querySelector('.toast-message').textContent = message;
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

// Clipboard Address Copy Automation
window.copyAddressToClipboard = function() {
  const addressText = "Rua José Retore - Santa Lúcia, Videira - SC, 89564-534";
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(addressText).then(() => {
      window.showToast("Endereço copiado para a área de transferência!");
    }).catch(() => {
      fallbackCopyText(addressText);
    });
  } else {
    fallbackCopyText(addressText);
  }
};

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    window.showToast("Endereço copiado com sucesso!");
  } catch (err) {
    window.showToast("Erro ao copiar. Endereço: " + text);
  }
  document.body.removeChild(textarea);
}

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar on Scroll
  const nav = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Intersection Observer for Smooth Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-scale-up, .stagger-parent');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Smooth number counter animation
  const countElements = document.querySelectorAll('.counter-val');
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const isFloat = el.getAttribute('data-float') === 'true';
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          
          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeProgress;

            if (isFloat) {
              el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
            } else {
              el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString('pt-BR')}${suffix}`;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          }

          requestAnimationFrame(updateCount);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countElements.forEach(el => countObserver.observe(el));
  }
});
