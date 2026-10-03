/**
 * DOM'CAR ESTÉTICA AUTOMOTIVA - INTERACTIVE BEFORE & AFTER COMPARISON SLIDER
 * Smooth mouse & touch draggable paint correction comparison
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('comparison-container');
  if (!container) return;

  const afterWrap = container.querySelector('.comparison-after-wrap');
  const afterImg = container.querySelector('.comparison-after');
  const divider = container.querySelector('.comparison-divider');
  let isDragging = false;

  function syncImageWidth() {
    if (afterImg && container) {
      afterImg.style.width = `${container.offsetWidth}px`;
    }
  }

  function setSliderPosition(xPos) {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;

    // Clamp between 5% and 95%
    const minX = rect.width * 0.05;
    const maxX = rect.width * 0.95;
    offsetX = Math.max(minX, Math.min(offsetX, maxX));

    const percentage = (offsetX / rect.width) * 100;
    afterWrap.style.width = `${percentage}%`;
    divider.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard accessibility
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', (e) => {
    const currentPercent = parseFloat(afterWrap.style.width) || 50;
    if (e.key === 'ArrowLeft') {
      const newPercent = Math.max(10, currentPercent - 5);
      afterWrap.style.width = `${newPercent}%`;
      divider.style.left = `${newPercent}%`;
    } else if (e.key === 'ArrowRight') {
      const newPercent = Math.min(90, currentPercent + 5);
      afterWrap.style.width = `${newPercent}%`;
      divider.style.left = `${newPercent}%`;
    }
  });

  // Resize listener
  window.addEventListener('resize', syncImageWidth);
  syncImageWidth();
});
