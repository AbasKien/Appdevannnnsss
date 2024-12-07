<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="brand-section">
          <h1 class="brand">Margatheo Store</h1>
          <p class="tagline">Welcome back! Please login to your account.</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
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
                placeholder="Enter your password"
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="auth-button">
            Sign In
          </button>

          <p class="auth-link">
            Don't have an account? 
            <router-link to="/signup" class="link">Register here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      error: null,
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.isLoading = true;
        this.error = null;

        // Basic validation
        if (!this.email || !this.password) {
          this.error = "Please fill in all fields";
          return;
        }

        // Send login request
        const response = await axios.post(
          "http://localhost:5555/login",
          {
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true
          }
        );

        // Handle successful login
        if (response.data) {
          // Store token and user info
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userEmail', response.data.email);
          localStorage.setItem('userRole', response.data.role);

          // Redirect based on role
          if (response.data.role === 'admin') {
            this.$router.push('/admin/dashboard');
          } else {
            this.$router.push('/home');
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

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

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
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
