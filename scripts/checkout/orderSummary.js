import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.7/+esm';
import { formatCurrency } from '../utils/money.js';
import { cart, deleteCartItem, saveToStorage,updateCartItem } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption,deliveryOptions } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

 

export function renderOrderSummary(){
  
  let cartSummaryhtml = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    if (!matchingProduct) return;

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

    cartSummaryhtml += `
  <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
           ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity
            js-product-quantity-${matchingProduct.id}">
              <span class="quantity-label">${cartItem.quantity}</span>
              <input class="quantity-input" type="number" value="${cartItem.quantity}">
             <span class="update-quantity-link link-primary js-update-button" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHtml(matchingProduct, cartItem)}
          </div>
        </div>
      </div>

`;

    
  });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryhtml;
document.querySelectorAll('.js-update-button').forEach((link) => {
  link.addEventListener('click', () => {
    const container = link.closest('.js-cart-item-container');
    const productId = link.dataset.productId;
    const isEditing = container.classList.contains('is-editing-quantity'); 

    if (isEditing) {
      const inputElement = container.querySelector('.quantity-input');
      const newQuantity = Number(inputElement.value);

      updateCartItem(productId, newQuantity);
      renderOrderSummary();
      renderPaymentSummary();
    } else {
      container.classList.toggle('is-editing-quantity'); 
    }
  });
});
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId; 
    deleteCartItem(productId);
    const ItemContainer = link.closest('.js-cart-item-container')
    ItemContainer.remove();
    renderPaymentSummary();
  });
}); 
document.querySelectorAll('.js-delivery-option-input').forEach((input) => {
  input.addEventListener('click', () => {

    const productId = input.dataset.productId;
    const deliveryOptionId = input.dataset.deliveryOptionId;
    const cartItem = cart.find((item) => item.productId === productId);

if (cartItem) {
  cartItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
  renderOrderSummary();
  renderPaymentSummary();
}

  });
});

}
 function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((option) => {
    const dateString = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
    const priceString = option.priceCents === 0 ? 'FREE' : `${formatCurrency(option.priceCents)} -`;

    html += `
      <div class="delivery-option js-delivery-option ${option.id === cartItem.deliveryOptionId ? 'selected' : ''}">
      <input type="radio" data-product-id="${matchingProduct.id}" 
      data-delivery-option-id="${option.id}" 
       ${option.id === cartItem.deliveryOptionId ? 'checked' : ''}
        class="delivery-option-input js-delivery-option-input" name="delivery-option-${matchingProduct.id}">
        <div>
          <div>${priceString} Shipping</div>
          <div>Get it by ${dateString}</div>
        </div>
      </div>
    `;
  });
  

  return html;
}
