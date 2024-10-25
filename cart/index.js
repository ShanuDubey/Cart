document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalPriceElement = document.getElementById("subtotal-price");
    const totalPriceElement = document.getElementById("total-price");
    const checkoutButton = document.getElementById("checkout-button");

    // Fetch cart data from the API
    fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889")
        .then(response => response.json())
        .then(data => {
            let cartItems = data.items;
            renderCartItems(cartItems);
            updateTotals(cartItems);
        })
        .catch(error => {
            console.error("Error fetching cart data:", error);
            cartItemsContainer.innerHTML = "<p>Failed to load cart items.</p>";
        });

    function renderCartItems(items) {
        cartItemsContainer.innerHTML = ""; // Clear existing items
        items.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-price="${item.price}">
                </div>
                <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                <div class="remove-item" data-id="${item.id}">🗑️</div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners for quantity change and remove item
        document.querySelectorAll(".cart-item-quantity").forEach(input => {
            input.addEventListener("change", updateItemSubtotal);
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", removeCartItem);
        });
    }

    function updateItemSubtotal(event) {
        const quantityInput = event.target;
        const price = parseFloat(quantityInput.dataset.price);
        const quantity = parseInt(quantityInput.value);
        const cartItem = quantityInput.closest(".cart-item");
        const itemPriceElement = cartItem.querySelector(".cart-item-price");

        // Update the subtotal for the item
        itemPriceElement.textContent = `₹${(price * quantity).toFixed(2)}`;
        updateTotals();
    }

    function removeCartItem(event) {
        const button = event.target;
        const cartItem = button.closest(".cart-item");
        cartItem.remove(); // Remove the item from the DOM
        updateTotals(); // Update totals after removal
    }

    function updateTotals() {
        const itemPrices = document.querySelectorAll(".cart-item-price");
        let subtotal = 0;

        itemPrices.forEach(priceElement => {
            const price = parseFloat(priceElement.textContent.replace('₹', ''));
            subtotal += price;
        });

        subtotalPriceElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalPriceElement.textContent = `₹${subtotal.toFixed(2)}`; // Assuming no additional fees for simplicity
    }

    // Checkout button functionality (for demonstration purposes)
    checkoutButton.addEventListener("click", () => {
        alert("Proceeding to checkout...");
        // Here you can implement the checkout logic
    });
});