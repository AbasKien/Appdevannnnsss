<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="brand-section">
          <h1 class="brand">Margatheo Store</h1>
          <p class="tagline">Create your account to get started</p>
        </div>

        <form @submit.prevent="register" class="auth-form">
          <div class="form-group">
            <label for="fullname">Full Name</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                id="fullname"
                v-model="fullname"
                required
                placeholder="Enter your full name"
                autocomplete="name"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Enter your email"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Create a password"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔐</span>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                required
                placeholder="Confirm your password"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="auth-button" :disabled="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <p class="auth-link">
            Already have an account? 
            <router-link to="/login" class="link">Login here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 20px 20px 0 0;
}

.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.brand {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.tagline {
  color: #64748b;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.95rem;
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

input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1a202c;
  transition: all 0.3s ease;
  background: #f8fafc;
}

input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  outline: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fee2e2;
}

.auth-button {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #7c3aed;
}

@media (max-width: 640px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem;
  }

  .brand {
    font-size: 1.75rem;
  }
}
</style>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: null,
      isLoading: false
    }
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match";
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post('http://localhost:5555/register', {
          fullname: this.fullname,
          email: this.email,
          password: this.password
        });

        if (response.status === 200) {
          // Show success message
          alert(response.data.message);
          // Redirect to login page
          this.$router.push('/login');
        }
      } catch (err) {
        console.error('Registration error:', err);
        this.error = err.response?.data?.message || "Registration failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>