/**
 * DOM'CAR ESTÉTICA AUTOMOTIVA - SMART WHATSAPP APPOINTMENT AUTOMATION
 * Generates pre-formatted WhatsApp booking messages directly without any pricing or budget clutter.
 */

const WHATSAPP_PHONE = '5549991999733'; // Official number: (49) 99199-9733

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read form values
    const vehicleType = form.querySelector('input[name="vehicle-type"]:checked')?.value || 'Não especificado';
    const serviceSelect = document.getElementById('service-select');
    const serviceName = serviceSelect ? serviceSelect.value : 'Estética Geral';
    const daySelect = document.getElementById('day-select');
    const preferredDay = daySelect ? daySelect.value : 'A combinar';
    const periodRadio = form.querySelector('input[name="preferred-period"]:checked')?.value || 'A combinar';
    const clientName = document.getElementById('client-name')?.value.trim() || 'Cliente';
    const vehicleModel = document.getElementById('vehicle-model')?.value.trim() || 'Não informado';
    const clientNotes = document.getElementById('client-notes')?.value.trim() || 'Nenhuma observação adicional.';

    // Construct the structured WhatsApp message
    const messageLines = [
      `🏁 *SOLICITAÇÃO DE AGENDAMENTO - DOM'CAR ESTÉTICA AUTOMOTIVA* 🏁`,
      ``,
      `👤 *Cliente:* ${clientName}`,
      `🚗 *Veículo:* ${vehicleModel} (${vehicleType})`,
      `✨ *Serviço Desejado:* ${serviceName}`,
      `📅 *Dia de Preferência:* ${preferredDay}`,
      `⏰ *Período Preferencial:* ${periodRadio}`,
      ``,
      `📝 *Observações:* ${clientNotes}`,
      ``,
      `Olá equipe Dom'car! Gostaria de verificar a disponibilidade na agenda para cuidar do meu veículo. Aguardo retorno para confirmação!`
    ];

    const fullMessage = messageLines.join('\n');
    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Trigger visual toast confirmation
    if (window.showToast) {
      window.showToast('Direcionando para o WhatsApp oficial da Dom\'car...');
    }
  });

  // Global trigger to preselect service from cards
  window.selectServiceAndScroll = function(serviceVal) {
    const serviceSelect = document.getElementById('service-select');
    const appointmentSection = document.getElementById('agendamento');
    
    if (serviceSelect && serviceVal) {
      serviceSelect.value = serviceVal;
    }

    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
      // Add subtle glow flash to appointment card
      const card = appointmentSection.querySelector('.appointment-glass-card');
      if (card) {
        card.style.borderColor = 'var(--color-brand)';
        card.style.boxShadow = '0 0 50px rgba(255, 22, 56, 0.5)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }, 1500);
      }
    }
  };
});
