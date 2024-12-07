<template>
  <div class="product-page">
    <!-- Top Announcement Bar -->
    <div class="announcement-bar">
      <p>🚀 Free shipping on orders over ₱2,000! Shop now.</p>
    </div>

    <!-- Header -->
    <header class="header">
      <div class="logo">Margatheo Store</div>
      <nav class="nav">
        <router-link to="/home" class="nav-link" :class="{ active: $route.path === '/home' }">Home</router-link>
        <router-link to="/product" class="nav-link" :class="{ active: $route.path === '/product' }">Shop</router-link>
      </nav>
      <div class="user-controls">
        <!-- Search Bar -->
        <div class="search-bar">
          <input type="text" v-model="searchQuery" @input="debouncedSearch" placeholder="Search products..." />
          <button><i class="fas fa-search"></i></button>
        </div>
      </div>
      <!-- Cart Icon -->
      <router-link to="/cart" class="cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-logo">
          <path d="M6 6h15l-1.5 9h-13L6 6z"></path>
          <path d="M6 6L4 4"></path>
          <path d="M20 6L22 4"></path>
          <circle cx="10" cy="19" r="2"></circle>
          <circle cx="18" cy="19" r="2"></circle>
        </svg>
        <span class="cart-count">{{ cartItemCount }}</span>
      </router-link>
    </header>

    <!-- Main Content -->
    <div class="container">
      <!-- Header section with title and description -->
      <div class="header-section">
        <h1>Our Products</h1>
        <p>Explore our premium collection of school supplies. Quality and style to help you succeed.</p>
      </div>

      <!-- Product grid -->
      <div class="product-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="`http://localhost:5555${product.image_url}`" :alt="product.name">
            <div class="product-overlay">
              <button @click="addToCart(product)" class="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">₱{{ formatPrice(product.price) }}</p>
            <div class="quantity-container">
              <button @click="decrementQuantity(product)" class="quantity-button" :disabled="product.orderQuantity <= 1">-</button>
              <input v-model.number="product.orderQuantity" type="number" min="1" :max="product.stock" class="quantity-input" />
              <button @click="incrementQuantity(product)" class="quantity-button" :disabled="product.orderQuantity >= product.stock">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-bottom">
        <p>&copy; 2024 Margatheo Store. All Rights Reserved. Powered by 
          <a href="http://localhost:8080/home" target="_blank">Margatheo&reg;</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import _ from 'lodash';

export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      searchQuery: '',
      cartItemCount: 0,
      loading: true,
    };
  },

  methods: {
    async fetchProducts() {
      try {
        this.loading = true;
        const response = await axios.get('http://localhost:5555/products');
        console.log('Products response:', response.data); // Debug log
        this.products = response.data.products.map(product => ({
          ...product,
          orderQuantity: 1
        }));
        this.filteredProducts = [...this.products];
      } catch (error) {
        console.error('Error fetching products:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } finally {
        this.loading = false;
      }
    },

    formatPrice(price) {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return numPrice.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    debouncedSearch: _.debounce(function () {
      if (!this.searchQuery) {
        this.filteredProducts = this.products;
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }, 300),

    async addToCart(product) {
      try {
        await axios.post('http://localhost:5555/cart/add', {
          productId: product.id,
          quantity: product.orderQuantity
        }, { withCredentials: true });
        
        alert('Product added to cart successfully');
        product.orderQuantity = 1;
        await this.updateCartItemCount();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Please log in to add items to cart');
          this.$router.push('/login');
        } else {
          console.error('Error adding to cart:', error);
          alert('Failed to add product to cart');
        }
      }
    },

    async updateCartItemCount() {
      try {
        const response = await axios.get('http://localhost:5555/cart', { withCredentials: true });
        this.cartItemCount = response.data.items.reduce((total, item) => total + item.quantity, 0);
      } catch (error) {
        console.error('Error updating cart count:', error);
        this.cartItemCount = 0;
      }
    },

    decrementQuantity(product) {
      if (product.orderQuantity > 1) {
        product.orderQuantity--;
      }
    },

    incrementQuantity(product) {
      if (product.orderQuantity < product.stock) {
        product.orderQuantity++;
      }
    }
  },

  async created() {
    await this.fetchProducts();
    await this.updateCartItemCount();
  }
};
</script>

<style scoped>
.product-page {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  color: #2d3748;
  min-height: 100vh;
}

.announcement-bar {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: #fff;
  text-align: center;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 5%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.nav {
  display: flex;
  gap: 2rem;
  margin: 0 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  margin-right: 1.5rem;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-bar input {
  border: none;
  outline: none;
  width: 250px;
  font-size: 0.95rem;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
}

.search-bar button {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.search-bar button:hover {
  color: #4f46e5;
}

.cart {
  position: relative;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cart:hover {
  background: rgba(79, 70, 229, 0.1);
}

.cart-logo {
  transition: all 0.3s ease;
}

.cart:hover .cart-logo {
  stroke: #4f46e5;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f4511e;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.header-section h1:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #4f46e5, #7c3aed);
}

.header-section p {
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
}

.product-overlay {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: rgba(79, 70, 229, 0.9);
  padding: 1rem;
  transition: bottom 0.3s ease;
}

.product-card:hover .product-overlay {
  bottom: 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: none;
  border-radius: 6px;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background: #f0f0f0;
}

.product-info {
  padding: 1rem;
  text-align: center;
}

.product-info h3 {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.2rem;
  color: #4f46e5;
  font-weight: 600;
}

.quantity-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quantity-button {
  background: #f3f4f6;
  border: none;
  color: #4b5563;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-button:hover:not(:disabled) {
  background: #e5e7eb;
  color: #4f46e5;
}

.quantity-button:disabled {
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

.footer {
  background: white;
  padding: 1.5rem 0;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.footer-bottom {
  color: #64748b;
  font-size: 0.9rem;
}

.footer-bottom a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.footer-bottom a:hover {
  color: #7c3aed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .header-section h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .product-info h3 {
    font-size: 1rem;
  }

  .price {
    font-size: 1.1rem;
  }
}
</style>
