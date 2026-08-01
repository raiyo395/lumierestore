import { renderProductGrid } from "./renderProducts.js";
renderProductGrid();


window.filterProducts = function() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    let cards = document.querySelectorAll('.product-container'); 
    
    cards.forEach(card => {
        let cardText = card.innerText.toLowerCase();
        
        if (cardText.includes(input)) {
            card.style.display = ""; 
        } else {
            card.style.display = "none"; 
        }
    });
};
