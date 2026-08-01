import { addToCart} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

export function renderProductGrid(){
   let productsHtml = "";
   products.forEach((product) => {
     productsHtml += `
    <div class="product-container">
  <img src="${product.image}" alt="${product.name}">
  <p>${product.name}</p>
  <p>$${formatCurrency(product.priceCents)}</p>
  
  <div class="purchase-controls">
    
          <div class="qty-container">
          <span class="qty-label">QTY:</span>
      <div class="lumiere-select">
        <button type="button" class="stepper-btn minus-btn js-minus-btn"
         data-product-id="${product.id}">-</button>
        <span class="stepper-val js-stepper-val-${product.id}">1</span>
        <button type="button" class="stepper-btn plus-btn js-plus-btn" 
        data-product-id="${product.id}">+</button>
      </div>
    </div>
        
        <button type="button" class="add-button js-add-button" data-product-id="${product.id}">
        Add To Cart</button>

      </div> 
    </div>

     `
   });
   document.querySelector('.js-products-grid').innerHTML = productsHtml;

 document.querySelectorAll('.js-add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const valElement = document.querySelector(`.js-stepper-val-${productId}`);
    const quantity = Number(valElement.textContent);
    addToCart(productId, quantity);
  });
});


   document.querySelectorAll('.js-minus-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const valElement = document.querySelector(`.js-stepper-val-${productId}`);

      let currentValue = Number(valElement.textContent);

      if (currentValue > 1) {
        currentValue -= 1;
        valElement.textContent = currentValue;
      }
    });
   });

   document.querySelectorAll('.js-plus-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const valElement = document.querySelector(`.js-stepper-val-${productId}`);

      let currentValue = Number(valElement.textContent);
      currentValue += 1;
      valElement.textContent = currentValue;
      
    });
   });
}