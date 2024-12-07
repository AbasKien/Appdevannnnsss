<template>
  <div class="thank-you-container">
    <div class="thank-you-card">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h1>Thank You for Your Order!</h1>
      <p class="order-id">Order ID: #{{ orderId }}</p>
      <p class="message">Your order has been successfully placed. We'll start processing it right away!</p>
      <div class="next-steps">
        <p>What's next?</p>
        <ul>
          <li>You can track your order in your profile</li>
        </ul>
      </div>
      <button class="home-btn" @click="goToHome">
        <i class="fas fa-home"></i> Back to Home
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThankYou',
  data() {
    return {
      orderId: this.$route.params.orderId || 'N/A'
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/home');
    }
  },
  mounted() {
    // Auto-redirect after 5 seconds
    setTimeout(() => {
      this.goToHome();
    }, 5000);
  }
}
</script>

<style scoped>
.thank-you-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc;
  padding: 20px;
}

.thank-you-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.success-icon {
  font-size: 80px;
  color: #48bb78;
  margin-bottom: 20px;
  animation: scale-in 0.5s ease-out;
}

.thank-you-card h1 {
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.order-id {
  color: #4a5568;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.message {
  color: #718096;
  margin-bottom: 30px;
  line-height: 1.6;
}

.next-steps {
  background: #f7fafc;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: left;
}

.next-steps p {
  color: #2d3748;
  font-weight: bold;
  margin-bottom: 10px;
}

.next-steps ul {
  list-style-type: none;
  padding: 0;
}

.next-steps li {
  color: #4a5568;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.next-steps li:before {
  content: "✓";
  color: #48bb78;
  position: absolute;
  left: 0;
}

.home-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.home-btn:hover {
  background: #3182ce;
  transform: translateY(-2px);
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
