<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1>Checkout</h1>
      
      <div class="checkout-grid">
        <!-- Left Column: Personal Information -->
        <div class="checkout-form">
          <div class="form-card">
            <div class="card-header">
              <h3>Personal Information</h3>
              <p class="subtitle">Please fill in your details for delivery</p>
            </div>
            <div class="card-body">
              <form @submit.prevent="checkout" class="needs-validation" novalidate>
                <div class="form-group">
                  <label for="contact-number">Contact Number</label>
                  <div class="input-wrapper">
                    <span class="input-icon">📱</span>
                    <input
                      type="tel"
                      id="contact-number"
                      v-model="form.contact_number"
                      required
                      placeholder="Enter your contact number"
                      @input="validateContactNumber"
                      maxlength="11"
                      pattern="[0-9]{11}"
                    />
                  </div>
                  <div class="invalid-feedback">Please enter a valid 11-digit contact number.</div>
                </div>

                <div class="form-group">
                  <label for="address">Shipping Address</label>
                  <div class="input-wrapper">
                    <span class="input-icon">📍</span>
                    <textarea
                      id="address"
                      v-model="form.address"
                      required
                      placeholder="Enter your complete shipping address"
                    ></textarea>
                  </div>
                  <div class="invalid-feedback">Please enter your address.</div>
                </div>

                <div class="form-group">
                  <label for="payment_method">Payment Method</label>
                  <div class="input-wrapper">
                    <span class="input-icon">💳</span>
                    <select v-model="form.payment_method" id="payment_method" required>
                      <option value="" disabled selected>Select payment method</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>
                  <div class="invalid-feedback">Please select a payment method.</div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="order-summary">
          <div class="summary-card">
            <div class="card-header">
              <h3>Order Summary</h3>
              <p class="subtitle">Review your order details</p>
            </div>
            <div class="card-body">
              <!-- Show cart items -->
              <div class="cart-items">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                  <div class="item-details">
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p>Quantity: {{ item.quantity }}</p>
                      <p class="item-price">₱{{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="summary-list">
                <div class="summary-item">
                  <span>Total Items</span>
                  <span class="value">{{ totalItems }} items</span>
                </div>
                <div class="summary-item">
                  <span>Subtotal</span>
                  <span class="value">₱{{ totalPrice }}</span>
                </div>
                <div class="summary-item">
                  <span>Shipping Fee</span>
                  <span class="value">₱58.00</span>
                </div>
                <div class="summary-total">
                  <span>Total Amount</span>
                  <span class="value">₱{{ (parseFloat(totalPrice) + 58).toFixed(2) }}</span>
                </div>
              </div>

              <div class="action-buttons">
                <button 
                  type="submit" 
                  class="btn-place-order" 
                  @click="checkout"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Processing...' : 'Place Order' }}
                </button>
                <button 
                  type="button" 
                  class="btn-back" 
                  @click="goToCart"
                  :disabled="isLoading"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        contact_number: "",
        address: "",
        payment_method: "",
      },
      isLoading: false,
    };
  },
  computed: {
    totalItems() {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice() {
      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      return cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
    cartItems() {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    }
  },
  methods: {
    validateContactNumber() {
      this.form.contact_number = this.form.contact_number.replace(/[^0-9]/g, "");
    },
    
    validateForm() {
      // Check contact number
      if (!this.form.contact_number || this.form.contact_number.length !== 11 || !/^\d+$/.test(this.form.contact_number)) {
        alert("Please enter a valid 11-digit contact number");
        return false;
      }

      // Check address
      if (!this.form.address || this.form.address.trim().length < 10) {
        alert("Please enter a complete shipping address (at least 10 characters)");
        return false;
      }

      // Check payment method
      if (!this.form.payment_method) {
        alert("Please select a payment method");
        return false;
      }

      // Check cart items
      if (!this.cartItems || this.cartItems.length === 0) {
        alert("Your cart is empty");
        this.$router.push('/cart');
        return false;
      }

      return true;
    },

    async checkout() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        // Check authentication
        await axios.get("http://localhost:5555/profile", {
          withCredentials: true
        });

        // Format cart items
        const items = this.cartItems.map(item => ({
          product_id: parseInt(item.id || item.product_id),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          name: item.name
        }));

        // Calculate total price including shipping
        const total_price = parseFloat(this.totalPrice) + 58;

        // Place order
        const orderResponse = await axios.post(
          "http://localhost:5555/orders",
          {
            contact_number: this.form.contact_number,
            address: this.form.address,
            payment_method: this.form.payment_method,
            total_price: total_price.toFixed(2),
            items: items
          },
          {
            withCredentials: true
          }
        );

        if (orderResponse.data.success) {
          // Clear cart from localStorage
          localStorage.removeItem("cartItems");
          
          // Redirect to thank you page
          this.$router.push({
            name: 'ThankYou',
            params: { 
              orderId: orderResponse.data.orderId,
              orderDetails: {
                total: total_price.toFixed(2),
                items: items,
                contact: this.form.contact_number,
                address: this.form.address,
                payment: this.form.payment_method
              }
            }
          });
        } else {
          throw new Error(orderResponse.data.message || "Failed to place order");
        }

      } catch (error) {
        console.error("Checkout error:", error);
        
        if (error.response?.status === 401) {
          // Save checkout data
          localStorage.setItem('checkoutData', JSON.stringify({
            contact_number: this.form.contact_number,
            address: this.form.address,
            payment_method: this.form.payment_method
          }));
          
          localStorage.setItem('redirectAfterLogin', '/checkout');
          this.$router.push("/login");
        } else {
          const message = error.response?.data?.message || error.message || "Failed to place order. Please try again.";
          alert(message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    goToCart() {
      this.$router.push("/cart");
    },
    loadProfileData() {
      axios.get("http://localhost:5555/profile", {
        withCredentials: true
      })
      .then(response => {
        if (response.data.success) {
          const profile = response.data.profile;
          // Pre-fill form with profile data
          this.form.contact_number = profile.phone || '';
          this.form.address = profile.address || '';
        }
      })
      .catch(error => {
        console.warn('Could not fetch profile data:', error);
        // Not critical, user can still fill the form manually
      });
    }
  },
  async created() {
    // Load cart items from localStorage
    const cartItems = localStorage.getItem("cartItems");
    if (!cartItems) {
      this.$router.push("/cart");
      return;
    }

    // Check for saved checkout data after login
    const savedCheckoutData = localStorage.getItem('checkoutData');
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        this.form = { ...this.form, ...data };
        localStorage.removeItem('checkoutData');
      } catch (error) {
        console.error('Error loading saved checkout data:', error);
      }
    }

    // Load user profile data
    this.loadProfileData();
  }
};
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 3rem 1rem;
  font-family: "Poppins", sans-serif;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 3rem;
  position: relative;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 2px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-card, .summary-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-card::before, .summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
}

.card-header {
  padding: 2rem 2rem 1rem;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.card-body {
  padding: 1rem 2rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
}

input, textarea, select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1a202c;
  transition: all 0.3s ease;
  background: #f8fafc;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input:focus, textarea:focus, select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  outline: none;
}

.invalid-feedback {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: none;
}

.summary-list {
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  color: #64748b;
  font-size: 1rem;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-top: 2px solid #e2e8f0;
  margin-top: 1rem;
  font-weight: 700;
  color: #1a202c;
  font-size: 1.2rem;
}

.value {
  color: #1a202c;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-place-order {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-place-order:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.btn-back {
  width: 100%;
  padding: 1rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #e2e8f0;
  color: #1a202c;
}

.cart-items {
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.cart-item {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.item-details {
  display: flex;
  gap: 1rem;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}

.item-info p {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.item-price {
  font-weight: 600;
  color: #4f46e5 !important;
}

.btn-place-order:disabled,
.btn-back:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    max-width: 700px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .card-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .card-body {
    padding: 1rem 1.5rem 1.5rem;
  }

  input, textarea, select {
    font-size: 0.95rem;
  }

  .btn-place-order, .btn-back {
    padding: 0.875rem;
  }
}
</style>
