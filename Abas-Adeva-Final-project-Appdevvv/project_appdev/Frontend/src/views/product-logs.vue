<template>
    <div class="d-flex">
      <!-- Sidebar -->
      <nav class="sidebar bg-dark text-white vh-100 p-3">
        <h4 class="text-white mb-4">Admin Dashboard</h4>
        <ul class="nav nav-pills flex-column">
          <li class="nav-item">
            <router-link to="/admin/dashboard" class="nav-link text-white" active-class="active">
              <i class="fas fa-home me-2"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link text-white" active-class="active">
              <i class="fas fa-box me-2"></i> Products
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/product-logs" class="nav-link text-white" active-class="active">
              <i class="fas fa-clipboard-list me-2"></i> Product Logs
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link text-white" active-class="active">
              <i class="fas fa-truck me-2"></i> Orders
            </router-link>
          </li>
          <li class="nav-item mt-auto">
            <button @click="handleLogout" class="btn btn-danger w-100 mt-3">
              <i class="fas fa-sign-out-alt me-2"></i> Logout
            </button>
          </li>
        </ul>
      </nav>
  
      <!-- Main Content -->
      <div class="flex-grow-1 p-4 main-content">
        <div class="container">
          <h2>Products and Logs</h2>
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Products</h5>
            </div>
            <div class="card-body">
              <!-- DataTable for Products -->
              <table id="productsTable" class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th class="text-center">ID</th>
                    <th class="text-center">Name</th>
                    <th class="text-center">Stock</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.stock }}</td>
                    <td>
                      <button class="btn btn-info" @click="showLogs(product.id)">View Logs</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal for Product Logs -->
      <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Product Logs</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <button class="btn btn-primary" @click="printLogs">Print</button>
                <button class="btn btn-success ms-2" @click="downloadCSV">Download CSV</button>
              </div>
              <table id="logsTable" class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Previous Quantity</th>
                    <th>Quantity Changed</th>
                    <th>New Quantity</th>
                    <th>Reason</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in selectedProductLogs" :key="log.log_id">
                    <td>{{ log.log_id }}</td>
                    <td>{{ log.previous_quantity }}</td>
                    <td>{{ log.quantity_changed }}</td>
                    <td>{{ log.new_quantity }}</td>
                    <td>{{ log.reason }}</td>
                    <td>{{ new Date(log.created_at).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const products = ref([]);
      const selectedProductLogs = ref([]);
      const showModal = ref(false);
  
      // Fetch products with logs from the server
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5555/products-with-logs', { withCredentials: true });
          products.value = response.data.products || [];
        } catch (error) {
          console.error('Error loading products', error);
        }
      };
  
      const showLogs = async (productId) => {
        try {
          const logs = products.value.filter(product => product.id === productId);
          selectedProductLogs.value = logs.map(log => ({
            log_id: log.log_id,
            previous_quantity: log.previous_quantity,
            quantity_changed: log.quantity_changed,
            new_quantity: log.new_quantity,
            reason: log.reason,
            created_at: log.created_at
          }));
          showModal.value = true;
          // Initialize DataTables for the modal
          setTimeout(() => {
            $('#logsTable').DataTable({
              responsive: true
            });
          }, 500);
        } catch (error) {
          console.error('Error loading logs for product', error);
        }
      };
  
      const closeModal = () => {
        showModal.value = false;
        selectedProductLogs.value = [];
      };
  
      // Function to print logs
      const printLogs = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Logs</title></head><body>');
        printWindow.document.write(document.querySelector('#logsTable').outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      };
  
      // Function to download logs as CSV
      const downloadCSV = () => {
        if (selectedProductLogs.value.length === 0) {
          alert('No logs available to download.');
          return;
        }
        const headers = ['ID', 'Previous Quantity', 'Quantity Changed', 'New Quantity', 'Reason', 'Created At'];
        const rows = selectedProductLogs.value.map(log => [
          log.log_id,
          log.previous_quantity,
          log.quantity_changed,
          log.new_quantity,
          log.reason,
          new Date(log.created_at).toLocaleString()
        ]);
  
        let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
        rows.forEach(row => {
          csvContent += row.join(',') + '\n';
        });
  
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'product_logs.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  
      onMounted(() => {
        fetchProducts();
        // Initialize DataTables for the main table
        setTimeout(() => {
          $('#productsTable').DataTable({
            responsive: true
          });
        }, 500);
      });
  
      return {
        products,
        selectedProductLogs,
        showLogs,
        closeModal,
        showModal,
        printLogs,
        downloadCSV
      };
    }
  };
  </script>
  