// precios (coinciden con Servicios)
const PRICES = {
  corte: 17000,
  barba: 12000,
  combo: 21000,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const fmt = new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });

function getQuantities() {
  return {
    corte: parseInt($('#qty-corte').value || '0', 10),
    barba: parseInt($('#qty-barba').value || '0', 10),
    combo: parseInt($('#qty-combo').value || '0', 10),
  };
}

function subtotal(q) {
  return q.corte*PRICES.corte + q.barba*PRICES.barba + q.combo*PRICES.combo;
}

// Promoción: 50% en el segundo (por servicio)
function promoSegundo50(q) {
  const dCorte = Math.floor(q.corte/2) * (PRICES.corte * 0.5);
  const dBarba = Math.floor(q.barba/2) * (PRICES.barba * 0.5);
  const dCombo = Math.floor(q.combo/2) * (PRICES.combo * 0.5);
  return dCorte + dBarba + dCombo;
}

// Promoción: 3x2 (por servicio)
function promo3x2(q) {
  const dCorte = Math.floor(q.corte/3) * PRICES.corte;
  const dBarba = Math.floor(q.barba/3) * PRICES.barba;
  const dCombo = Math.floor(q.combo/3) * PRICES.combo;
  return dCorte + dBarba + dCombo;
}

// Promoción: 10% si supera 30.000
function promo10off30k(sub) {
  return sub >= 30000 ? sub * 0.10 : 0;
}

function calc() {
  const q = getQuantities();
  const sub = subtotal(q);

  const promo = document.querySelector('input[name="promo"]:checked').value;

  let descuento = 0;
  if (promo === 'segundo50') descuento = promoSegundo50(q);
  else if (promo === '3x2') descuento = promo3x2(q);
  else if (promo === '10off30k') descuento = promo10off30k(sub);

  const total = Math.max(0, sub - descuento);

  $('#subtotal').textContent = fmt.format(sub);
  $('#descuento').textContent = fmt.format(descuento);
  $('#total').textContent = fmt.format(total);
}

function init() {
  // recalcular ante cualquier cambio
  ['#qty-corte','#qty-barba','#qty-combo'].forEach(id => {
    $(id).addEventListener('input', calc);
  });
  $$('input[name="promo"]').forEach(r => r.addEventListener('change', calc));

  calc();
}

document.addEventListener('DOMContentLoaded', init);
