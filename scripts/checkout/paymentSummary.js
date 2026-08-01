import { formatCurrency } from '../utils/money.js';
import { cart, saveToStorage } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    totalQuantity += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  let totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  let taxCents = totalBeforeTaxCents * 0.1;
  let totalCents = totalBeforeTaxCents + taxCents;

  let paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalQuantity}):</div>
      <div class="payment-summary-money">${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', () => {
       if (cart.length === 0) {
      return; // do nothing if cart is already empty
    }
      cart.length = 0;
      saveToStorage();
      document.querySelector('.js-order-summary').innerHTML = '';
      renderPaymentSummary();

      document.querySelector('.success-message').style.display = 'block';
      setTimeout(() => {
        document.querySelector('.success-message').style.display = 'none';
      }, 3000);
    });
}