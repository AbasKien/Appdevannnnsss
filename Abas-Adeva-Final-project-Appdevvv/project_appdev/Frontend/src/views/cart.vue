<template>
  <div class="cart-page">
    <div class="cart-container">
      <!-- Shopping Cart Section -->
      <div class="cart">
        <h2 class="cart-title">Shopping Cart</h2>
        <p class="cart-items-count">{{ totalItems }} items</p>

        <div v-if="cartItems.length > 0" class="cart-items-list">
          <!-- Loop through cart items -->
          <div v-for="item in cartItems" :key="item.cart_id" class="cart-item">
            <img :src="`http://localhost:5555${item.image_url}`" alt="Item image" class="cart-item-image" />
            <div class="cart-item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">₱{{ (Number(item.price) || 0).toFixed(2) }}</p>
              <div class="quantity-controls">
                <button @click="decrementQuantity(item)" :disabled="item.quantity <= 1">-</button>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  :max="item.stock"
                  class="quantity-input"
                  @change="updateCartQuantity(item)"
                />
                <button @click="incrementQuantity(item)" :disabled="item.quantity >= item.stock">+</button>
              </div>
            </div>
            <button @click="removeItem(item.cart_id)" class="remove-button">✕</button>
          </div>
        </div>

        <div v-else class="empty-cart">
          <p>Your cart is empty. Start shopping now!</p>
        </div>

        <router-link to="/product" class="back-to-shop">← Back to shop</router-link>
      </div>

      <!-- Summary Section -->
      <div class="summary">
        <h2 class="summary-title">Summary</h2>
        <div class="summary-item">
          <span>ITEMS {{ totalItems }}</span>
          <span>₱{{ totalCost.toFixed(2) }}</span>
        </div>
        <div class="summary-item">
          <label for="shipping">SHIPPING</label>
          <select id="shipping" class="shipping-select">
            <option value="58">Standard Delivery - ₱58.00</option>
          </select>
        </div>
        <div class="summary-item">
          <label for="give-code">Voucher</label> <br>
          <div class="give-code-container">
            <input type="text" id="give-code" placeholder="Enter your code" />
            <button>→</button>
          </div>
        </div>
        <div class="summary-total">
          <span>TOTAL PRICE</span>
          <span>₱{{ (totalCost + 58).toFixed(2) }}</span>
        </div>
        <button @click="checkout" class="checkout-button" :disabled="cartItems.length === 0">CHECKOUT</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cartItems: [], // Initialize an empty array for cart items
      loading: false,
    };
  },
  computed: {
    // Calculate the total number of items in the cart
    totalItems() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    // Calculate the total cost of items in the cart
    totalCost() {
      return this.cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
      );
    },
  },
  methods: {
    // Fetch cart items from the backend
    async fetchCartItems() {
      try {
        this.loading = true;
        const response = await axios.get('http://localhost:5555/cart', { withCredentials: true });
        this.cartItems = response.data.items;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        } else {
          console.error('Error fetching cart:', error);
          alert('Failed to load cart items');
        }
      } finally {
        this.loading = false;
      }
    },

    // Increment the quantity of an item
    async incrementQuantity(item) {
      if (item.quantity < item.stock) {
        item.quantity++;
        await this.updateCartQuantity(item);
      }
    },

    // Decrement the quantity of an item
    async decrementQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        await this.updateCartQuantity(item);
      }
    },

    // Update cart item quantity
    async updateCartQuantity(item) {
      try {
        await axios.put('http://localhost:5555/cart/update-quantity', {
          cartId: item.cart_id,
          quantity: item.quantity
        }, { withCredentials: true });
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
        // Refresh cart to get the correct state
        await this.fetchCartItems();
      }
    },

    // Remove an item from the cart
    async removeItem(cartId) {
      try {
        await axios.delete('http://localhost:5555/cart/remove', {
          data: { cartId },
          withCredentials: true
        });
        await this.fetchCartItems(); // Refresh the cart
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item from cart');
      }
    },

    // Handle the checkout process
    checkout() {
      try {
        // Save cart items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        
        // Navigate to checkout
        this.$router.push('/checkout');
      } catch (error) {
        console.error('Error proceeding to checkout:', error);
        alert('Failed to proceed to checkout. Please try again.');
      }
    }
  },

  // Fetch cart items when the component is created
  async created() {
    await this.fetchCartItems();
  }
};
</script>

<style scoped>
/* Modern E-commerce Styling */
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 2rem 5%;
  font-family: "Poppins", sans-serif;
  color: #2d3748;
}

.cart-container {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }
}

/* Cart Section */
.cart {
  flex: 1.5;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.cart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 16px 16px 0 0;
}

.cart-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.cart-items-count {
  color: #4b5563;
  margin-bottom: 2rem;
}

/* Cart Items */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.item-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 1rem;
}

/* Quantity Controls */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  color: #4b5563;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-controls button:hover:not(:disabled) {
  background: #4f46e5;
  color: white;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.25rem;
  font-size: 0.95rem;
}

.remove-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.remove-button:hover {
  color: #ef4444;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 3rem 0;
  color: #4b5563;
}

/* Back to Shop Link */
.back-to-shop {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #4f46e5;
  font-weight: 600;
  margin-top: 2rem;
  transition: color 0.3s ease;
}

.back-to-shop:hover {
  color: #7c3aed;
}

/* Summary Section */
.summary {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: relative;
}

.summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 16px 16px 0 0;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.shipping-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  margin-top: 0.5rem;
  outline: none;
  transition: all 0.3s ease;
}

.shipping-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.give-code-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.give-code-container input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.give-code-container input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.give-code-container button {
  padding: 0.75rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.give-code-container button:hover {
  background: #7c3aed;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
  font-weight: 600;
  font-size: 1.2rem;
  color: #1a202c;
}

.checkout-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.checkout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-page {
    padding: 1rem;
  }

  .cart-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cart-item-image {
    width: 150px;
    height: 150px;
  }

  .remove-button {
    top: 0.5rem;
    right: 0.5rem;
  }

  .quantity-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cart-container {
    width: 100%;
  }

  .cart, .summary {
    padding: 1rem;
  }
}
</style>
