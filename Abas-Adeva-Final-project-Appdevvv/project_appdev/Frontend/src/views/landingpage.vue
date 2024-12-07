<template>
  <div class="landing-page">
    <!-- Announcement Bar -->
    <div class="announcement-bar">
      Enjoy a 3-Day Return or Refund Guarantee for Every Purchase!
    </div>

    <!-- Header -->
    <header class="header">
      <div class="logo">Margatheo Store</div>
      <div class="nav-controls">
        <router-link to="/login" class="login-button">Login</router-link>
      </div>
    </header>

    <!-- Banner Section -->
    <section class="banner">
      <div class="content">
        <p class="collection">School Supplies Made Easy</p>
        <h1>Your One-Stop Shop for Educational Essentials</h1>
        <p class="description">
          Find everything you need—from durable backpacks to eco-friendly notebooks—all in one place.
        </p>
        <router-link to="/login" class="cta-button">Get Started</router-link>
      </div>
      <div class="image">
        <img src="https://m.media-amazon.com/images/I/91qkR4QX71L.jpg" alt="School Supplies" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>Why Choose Us?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-shipping-fast"></i>
          <h3>Fast Delivery</h3>
          <p>Get your supplies delivered right to your doorstep</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-tag"></i>
          <h3>Best Prices</h3>
          <p>Competitive prices on all school supplies</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-shield-alt"></i>
          <h3>Quality Assured</h3>
          <p>All products are quality checked</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-undo"></i>
          <h3>Easy Returns</h3>
          <p>3-Day Return or Refund Guarantee</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p>Margatheo Store</p>
        <p>5200</p>
        <p>+639150232461</p>
        <p>margatheostore@gmail.com</p>
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
export default {
  name: "LandingPage"
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

.login-button {
  text-decoration: none;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

/* Banner Section */
.banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 4rem 5%;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.banner .content {
  padding-right: 2rem;
}

.collection {
  font-size: 1.1rem;
  color: #4f46e5;
  margin-bottom: 1rem;
  font-weight: 600;
}

.banner h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.description {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.banner .image {
  position: relative;
  height: 100%;
}

.banner .image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Features Section */
.features {
  padding: 4rem 5%;
  background: white;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #1a202c;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2rem;
  color: #4f46e5;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1a202c;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 3rem 5% 2rem;
}

.footer-contact {
  text-align: center;
  margin-bottom: 2rem;
}

.footer-contact h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.footer-contact p {
  margin: 0.5rem 0;
  color: #a0aec0;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
}

.footer-bottom p {
  color: #a0aec0;
}

.footer-bottom a {
  color: #4f46e5;
  text-decoration: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .banner .content {
    padding-right: 0;
  }

  .banner h1 {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>