/**
 * DOM'CAR ESTÉTICA AUTOMOTIVA - REAL-TIME STATUS & OPERATING HOURS AUTOMATION
 * Calculates live opening status based on official establishment hours in Videira - SC
 */

// Schedule configuration based on official Google Maps listing
const DOMCAR_SCHEDULE = {
  // 0: Domingo, 1: Segunda, 2: Terça, 3: Quarta, 4: Quinta, 5: Sexta, 6: Sábado
  0: { name: 'Domingo', open: false, ranges: [] },
  1: { name: 'Segunda-feira', open: true, ranges: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:30' }] },
  2: { name: 'Terça-feira', open: true, ranges: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:30' }] },
  3: { name: 'Quarta-feira', open: true, ranges: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:30' }] },
  4: { name: 'Quinta-feira', open: true, ranges: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:30' }] },
  5: { name: 'Sexta-feira', open: true, ranges: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '17:30' }] },
  6: { name: 'Sábado', open: true, ranges: [{ start: '09:00', end: '16:00' }] }
};

function parseTimeToMinutes(timeStr) {
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
}

function getVideiraTime() {
  // Get time formatted for America/Sao_Paulo (Videira - SC timezone UTC-3)
  const now = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  let hours = 0, minutes = 0;
  for (const part of parts) {
    if (part.type === 'hour') hours = parseInt(part.value, 10);
    if (part.type === 'minute') minutes = parseInt(part.value, 10);
  }
  
  // Calculate local day of week in Brazil timezone
  const dateStr = now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
  const localDate = new Date(dateStr);
  const dayOfWeek = localDate.getDay();
  const currentTotalMinutes = hours * 60 + minutes;

  return { dayOfWeek, hours, minutes, currentTotalMinutes };
}

function checkLiveStatus() {
  const { dayOfWeek, hours, minutes, currentTotalMinutes } = getVideiraTime();
  const daySchedule = DOMCAR_SCHEDULE[dayOfWeek];
  
  let status = {
    isOpen: false,
    isLunch: false,
    statusText: 'Fechado',
    detailText: '',
    pillClass: 'closed',
    dayIndex: dayOfWeek
  };

  if (!daySchedule.open) {
    status.statusText = 'Fechado Hoje';
    status.detailText = 'Reabrimos segunda às 08:00';
    status.pillClass = 'closed';
    return status;
  }

  // Check week days with lunch break (Mon-Fri)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const morningStart = parseTimeToMinutes('08:00');
    const morningEnd = parseTimeToMinutes('12:00');
    const afternoonStart = parseTimeToMinutes('13:00');
    const afternoonEnd = parseTimeToMinutes('17:30');

    if (currentTotalMinutes >= morningStart && currentTotalMinutes < morningEnd) {
      status.isOpen = true;
      status.statusText = 'Aberto Agora';
      status.detailText = 'Aberto até 12:00 (Pausa almoço 12h-13h)';
      status.pillClass = 'open';
    } else if (currentTotalMinutes >= morningEnd && currentTotalMinutes < afternoonStart) {
      status.isLunch = true;
      status.statusText = 'Intervalo de Almoço';
      status.detailText = 'Reabrimos às 13:00 • Atendimento até 17:30';
      status.pillClass = 'lunch';
    } else if (currentTotalMinutes >= afternoonStart && currentTotalMinutes < afternoonEnd) {
      status.isOpen = true;
      status.statusText = 'Aberto Agora';
      status.detailText = 'Aberto até 17:30';
      status.pillClass = 'open';
    } else if (currentTotalMinutes < morningStart) {
      status.statusText = 'Fechado no Momento';
      status.detailText = 'Abrimos hoje às 08:00';
      status.pillClass = 'closed';
    } else {
      // After 17:30
      if (dayOfWeek === 5) {
        status.statusText = 'Fechado';
        status.detailText = 'Abrimos sábado às 09:00';
      } else {
        status.statusText = 'Fechado';
        status.detailText = 'Abrimos amanhã às 08:00';
      }
      status.pillClass = 'closed';
    }
  } else if (dayOfWeek === 6) {
    // Saturday: 09:00 - 16:00
    const satStart = parseTimeToMinutes('09:00');
    const satEnd = parseTimeToMinutes('16:00');

    if (currentTotalMinutes >= satStart && currentTotalMinutes < satEnd) {
      status.isOpen = true;
      status.statusText = 'Aberto Agora';
      status.detailText = 'Atendimento contínuo até 16:00';
      status.pillClass = 'open';
    } else if (currentTotalMinutes < satStart) {
      status.statusText = 'Fechado no Momento';
      status.detailText = 'Abrimos hoje às 09:00';
      status.pillClass = 'closed';
    } else {
      status.statusText = 'Fechado';
      status.detailText = 'Reabrimos segunda-feira às 08:00';
      status.pillClass = 'closed';
    }
  }

  return status;
}

function updateStatusUI() {
  const status = checkLiveStatus();

  // Update Navbar Pill
  const navStatusPill = document.getElementById('nav-live-status');
  if (navStatusPill) {
    const dot = navStatusPill.querySelector('.status-dot');
    const label = navStatusPill.querySelector('.status-label');
    if (dot && label) {
      dot.className = `status-dot ${status.pillClass}`;
      label.textContent = status.statusText;
    }
  }

  // Update Hero/Banner Status Bar
  const heroStatusBadge = document.getElementById('hero-status-badge');
  if (heroStatusBadge) {
    const dot = heroStatusBadge.querySelector('.status-dot');
    const title = heroStatusBadge.querySelector('.status-bar-title');
    const subtitle = heroStatusBadge.querySelector('.status-bar-subtitle');
    if (dot) dot.className = `status-dot ${status.pillClass}`;
    if (title) title.textContent = status.statusText;
    if (subtitle) subtitle.textContent = status.detailText;
  }

  // Highlight Current Day in Hours Schedule Table
  const rows = document.querySelectorAll('.hours-row[data-day]');
  rows.forEach(row => {
    const rowDay = parseInt(row.getAttribute('data-day'), 10);
    if (rowDay === status.dayIndex) {
      row.classList.add('is-today');
    } else {
      row.classList.remove('is-today');
    }
  });
}

// Initialize on DOM load and poll every 30 seconds
document.addEventListener('DOMContentLoaded', () => {
  updateStatusUI();
  setInterval(updateStatusUI, 30000);
});
