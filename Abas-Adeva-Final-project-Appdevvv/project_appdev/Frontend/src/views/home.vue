<template>
  <div class="homepage">
    <!-- Announcement Bar -->
    <div class="announcement-bar">
      Enjoy a 3-Day Return or Refund Guarantee for Every Purchase!
    </div>

    <!-- Header -->
    <header class="header">
      <div class="logo">Margatheo Store</div>
      <nav class="nav">
        <router-link to="/home" class="nav-link" :class="{ active: $route.path === '/home' }">Home</router-link>
        <router-link to="/product" class="nav-link" :class="{ active: $route.path === '/product' }">Shop</router-link>
      </nav>
      <div class="user-controls">
        <div class="user-menu">
          <img src="https://libapps-au.s3-ap-southeast-2.amazonaws.com/accounts/12227/images/Circle_Librarian.png"
            alt="User Avatar" 
            class="user-avatar" 
            @click="toggleDropdown" />
          <div class="dropdown" v-show="isDropdownOpen">
            <a href="/profile">Profile</a>
            <a href="javascript:void(0)" @click="handleLogout">Log Out</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Banner Section -->
    <section class="banner">
      <div class="content">
        <p class="collection">Back-to-School Essentials</p>
        <h1>Gear Up for the Year Ahead with Premium Supplies</h1>
        <p class="description">
          Find everything you need—from durable backpacks to eco-friendly notebooks—all in one place.
        </p>
        <router-link to="/product" class="cta-button">Shop Now</router-link>
      </div>
      <div class="image">
        <img src="https://m.media-amazon.com/images/I/91qkR4QX71L.jpg" alt="School Supplies" />
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-list">
        <div class="product-card" v-for="n in 4" :key="n">
          <img src="https://via.placeholder.com/200" alt="Product Image" class="product-image" />
          <h3 class="product-title">Product Title {{ n }}</h3>
          <p class="product-price">₱20</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p>Margatheo Store</p>
        <p>5200</p>
        <p> +639150232461</p>
        <p> margatheostore@gmail.com</p>
      </div>
      <div class="footer-bottom">
        <p>
          &copy; 2024 Margatheo Store. All Rights Reserved. Powered by
          <a href="http://localhost:8080/home" target="_blank">Margatheo&reg;</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "HomePage",
  
  data() {
    return {
      isDropdownOpen: false
    }
  },

  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    async handleLogout(event) {
      event.preventDefault();
      try {
        console.log('Logging out...');
        await axios.post('http://localhost:5555/logout', {}, { withCredentials: true });
        localStorage.removeItem('userRole');
        this.$router.push('/login');
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  },

  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const userMenu = document.querySelector('.user-menu');
      if (userMenu && !userMenu.contains(e.target)) {
        this.isDropdownOpen = false;
      }
    });
  },

  beforeDestroy() {
    // Clean up event listener
    document.removeEventListener('click', this.closeDropdown);
  }
};
</script>

<style scoped>
/* Modern E-commerce Styling */
body {
  margin: 0;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  color: #2d3748;
}

/* Announcement Bar */
.announcement-bar {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: #fff;
  text-align: center;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 5%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

/* User Menu */
.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: #4f46e5;
}

.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  overflow: hidden;
  transform-origin: top right;
  transition: all 0.3s ease;
  opacity: 1;
  transform: scale(1);
  z-index: 1000;
}

.dropdown a {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dropdown a:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

/* Banner Section */
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 5%;
  background: white;
  margin: 2rem auto;
  max-width: 1400px;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
}

.content {
  max-width: 50%;
  padding-right: 2rem;
}

.collection {
  color: #4f46e5;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 20px;
}

.banner h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image img {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
}

.image img:hover {
  transform: rotate(0deg);
}

/* Featured Products */
.featured-products {
  padding: 4rem 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.featured-products h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.featured-products h2::after {
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

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.product-card:hover::before {
  opacity: 1;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e5e7eb;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 1rem;
}

.product-price {
  color: #4f46e5;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0.5rem 1rem 1rem;
}

/* Footer */
.footer {
  background: white;
  padding: 4rem 5% 2rem;
  margin-top: 4rem;
  border-top: 1px solid #e5e7eb;
}

.footer-contact {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-contact h4 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-contact p {
  color: #4b5563;
  margin: 0.5rem 0;
  font-size: 1rem;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.footer-bottom a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .banner {
    flex-direction: column;
    text-align: center;
    padding: 3rem 2rem;
  }

  .content {
    max-width: 100%;
    padding-right: 0;
    margin-bottom: 2rem;
  }

  .banner h1 {
    font-size: 2.5rem;
  }

  .image img {
    transform: none;
    max-width: 80%;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-wrap: wrap;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .product-list {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .nav {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .banner h1 {
    font-size: 1.75rem;
  }

  .collection {
    font-size: 0.8rem;
  }

  .description {
    font-size: 1rem;
  }
}
</style>