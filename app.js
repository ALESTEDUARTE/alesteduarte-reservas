const route = document.getElementById('route');
const motos = document.getElementById('motos');
const total = document.getElementById('total');
const form = document.getElementById('booking-form');

function updateTotal(){
  const option = route.options[route.selectedIndex];
  const price = Number(option?.dataset?.price || 0);
  const units = Number(motos.value || 0);
  total.textContent = price ? `${price * units} €` : '—';
}
route.addEventListener('change', () => {
  updateTotal();
  const time = document.getElementById('time');
  // Regla operativa provisional: la ruta de 60 min por la tarde solo puede salir a las 16:00.
  [...time.options].forEach(o => o.hidden = false);
  if (route.value === '60') {
    [...time.options].forEach(o => {
      if (o.value && ['16:30','17:00','17:30','18:00','18:30','19:00'].includes(o.value)) o.hidden = true;
    });
  }
});
motos.addEventListener('change', updateTotal);

document.querySelectorAll('.route-select').forEach(btn => {
  btn.addEventListener('click', () => {
    route.value = btn.dataset.route;
    route.dispatchEvent(new Event('change'));
    document.getElementById('reservar').scrollIntoView({behavior:'smooth'});
  });
});

const today = new Date();
today.setDate(today.getDate() + 1);
document.getElementById('date').min = today.toISOString().split('T')[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('demo-dialog').showModal();
});
updateTotal();
