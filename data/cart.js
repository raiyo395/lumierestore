import { deliveryOptions } from './deliveryOptions.js';

export let cart = [];

loadFromStorage();

export function loadFromStorage() {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  updateCartQuantity();
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliveryOptions[0];
}

export function addToCart(productId, quantity = 1) {
  let matchingItem;
  cart.forEach((item) => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }

  updateCartQuantity();
  saveToStorage();
}

export function updateCartItem(productId, newQuantity) {
  const item = cart.find((cartItem) => String(cartItem.productId) === String(productId));
  if (!item) return;

  if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
    return;
  }

  item.quantity = newQuantity;
  updateCartQuantity();
  saveToStorage();
}

export function deleteCartItem(idToDelete) {
  const newCart = cart.filter(cartItem => cartItem.productId !== idToDelete);
  cart = newCart;
  updateCartQuantity();
  saveToStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  const cartCountElement = document.querySelector('.js-cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartQuantity;
  }
}
