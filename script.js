const CHECKOUT_URL = 'https://universepay.online/pay/f77f15bc-d423-46fb-95f9-eeaeaa6e4ab3';
const MINIMUM_AMOUNT = 15;
const customAmount = document.querySelector('#customAmount');
const donationCard = document.querySelector('.donation-card');
const toast = document.querySelector('#toast');

function checkoutUrl(amount) {
  const destination = new URL(CHECKOUT_URL);
  destination.searchParams.set('amount', String(amount));

  const currentParams = new URLSearchParams(window.location.search);
  currentParams.forEach((value, key) => {
    if (key !== 'amount' && !destination.searchParams.has(key)) {
      destination.searchParams.set(key, value);
    }
  });

  return destination.toString();
}

function openDonation(value, sourceButton) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < MINIMUM_AMOUNT) {
    customAmount.focus();
    customAmount.setAttribute('aria-invalid', 'true');
    customAmount.closest('.custom-amount').classList.add('invalid');
    showToast('El importe mínimo es de $15');
    return;
  }

  customAmount.removeAttribute('aria-invalid');
  customAmount.closest('.custom-amount').classList.remove('invalid');
  if (sourceButton) {
    sourceButton.disabled = true;
    sourceButton.setAttribute('aria-busy', 'true');
  }
  window.location.assign(checkoutUrl(amount));
}

document.querySelectorAll('.amount').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.amount').forEach((option) => option.classList.remove('selected'));
    button.classList.add('selected');
    setTimeout(() => openDonation(button.dataset.amount, button), 140);
  });
});

document.querySelector('#customDonate').addEventListener('click', (event) => {
  openDonation(customAmount.value, event.currentTarget);
});

customAmount.addEventListener('input', () => {
  customAmount.removeAttribute('aria-invalid');
  customAmount.closest('.custom-amount').classList.remove('invalid');
});

customAmount.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') openDonation(customAmount.value, document.querySelector('#customDonate'));
});

document.querySelectorAll('.scroll-donate').forEach((button) => {
  button.addEventListener('click', () => donationCard.scrollIntoView({ behavior: 'smooth', block: 'center' }));
});

document.querySelector('#shareButton').addEventListener('click', async () => {
  const data = { title: document.title, text: 'Conoce la historia de Sophia y ayuda a su tratamiento.', url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(location.href);
      showToast('Enlace copiado');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('No fue posible compartir');
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

const progress = document.querySelector('.progress-track i');
const progressObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    progress.style.width = '81%';
    progressObserver.disconnect();
  }
}, { threshold: .4 });
progressObserver.observe(progress);
