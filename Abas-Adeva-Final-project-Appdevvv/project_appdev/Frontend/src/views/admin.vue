<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <nav class="sidebar bg-dark text-white vh-100 p-3">
      <h4 class="text-white mb-4">Admin Dashboard</h4>
      <ul class="nav nav-pills flex-column">
        <!-- Dashboard Link -->
        <li class="nav-item">
          <router-link to="/admin/dashboard" class="nav-link text-white" active-class="active">
            <i class="fas fa-home me-2"></i> Dashboard
          </router-link>
        </li>
        
        <!-- Products Link -->
        <li class="nav-item">
          <router-link to="/admin/products" class="nav-link text-white" active-class="active">
            <i class="fas fa-box me-2"></i> Products
          </router-link>
        </li>

        <!-- Product Logs Link -->
        <li class="nav-item">
          <router-link to="/admin/product-logs" class="nav-link text-white" active-class="active">
            <i class="fas fa-clipboard-list me-2"></i> Product Logs
          </router-link>
        </li>

        <!-- Orders Link -->
        <li class="nav-item">
          <router-link to="/admin/orders" class="nav-link text-white" active-class="active">
            <i class="fas fa-truck me-2"></i> Orders
          </router-link>
        </li>

        <!-- Logout Button -->
        <li class="nav-item mt-auto">
          <button @click="handleLogout" class="btn btn-danger w-100 mt-3">
            <i class="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4 main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    async handleLogout() {
      try {
        console.log("Logging out...");
        await axios.post("http://localhost:5555/logout", {}, { withCredentials: true });
        localStorage.removeItem("userRole");
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
  },
};
</script>