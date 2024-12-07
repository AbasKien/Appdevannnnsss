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
    <div class="flex-grow-1 p-4">
      <div class="container-fluid">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Order Management</h4>
          </div>
          <div class="card-body">
            <!-- Order Statistics -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card bg-warning text-white">
                  <div class="card-body">
                    <h5>To Pay</h5>
                    <h3>{{ pendingOrders }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-primary text-white">
                  <div class="card-body">
                    <h5>To Ship</h5>
                    <h3>{{ shippedOrders }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-info text-white">
                  <div class="card-body">
                    <h5>To Deliver</h5>
                    <h3>{{ toDeliverOrders }}</h3>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card bg-success text-white">
                  <div class="card-body">
                    <h5>Completed</h5>
                    <h3>{{ completedOrders }}</h3>
                  </div>
                </div>
              </div>
            </div>

            <!-- Orders Table -->
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="bg-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>#{{ order.id }}</td>
                    <td>{{ order.fullname || 'Customer' }}</td>
                    <td>{{ order.contact_number }}</td>
                    <td>₱{{ parseFloat(order.total_price).toFixed(2) }}</td>
                    <td>
                      <span :class="getStatusBadgeClass(order.status)">
                        {{ getStatusDisplay(order.status) }}
                      </span>
                    </td>
                    <td>{{ formatDate(order.created_at) }}</td>
                    <td>
                      <div class="d-flex gap-2">
                        <select 
                          v-model="order.status" 
                          @change="updateStatus(order.id, $event.target.value)"
                          class="form-select form-select-sm me-2"
                          style="width: auto;"
                        >
                          <option value="pending">To Pay</option>
                          <option value="ship">To Ship</option>
                          <option value="delivered">To Deliver</option>
                          <option value="complete">Complete</option>
                        </select>
                        <button 
                          @click="viewDetails(order)"
                          class="btn btn-info btn-sm"
                        >
                          <i class="fas fa-eye"></i> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Order Details Modal -->
        <div class="modal fade" id="orderDetailsModal" tabindex="-1" ref="orderModal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Order Details</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body" v-if="selectedOrder">
                <div class="row mb-4">
                  <div class="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> {{ selectedOrder.fullname }}</p>
                    <p><strong>Contact:</strong> {{ selectedOrder.contact_number }}</p>
                    <p><strong>Address:</strong> {{ selectedOrder.address }}</p>
                  </div>
                  <div class="col-md-6">
                    <h6>Order Information</h6>
                    <p><strong>Order ID:</strong> #{{ selectedOrder.id }}</p>
                    <p><strong>Status:</strong> {{ getStatusDisplay(selectedOrder.status) }}</p>
                    <p><strong>Payment Method:</strong> Cash on Delivery</p>
                    <p><strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                  </div>
                </div>
                <h6>Order Items</h6>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in orderItems" :key="item.id">
                      <td>{{ item.name }}</td>
                      <td>₱{{ item.price }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>₱{{ (item.price * item.quantity).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="text-end"><strong>Total:</strong></td>
                      <td>₱{{ selectedOrder.total_price }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'AdminOrder',
  data() {
    return {
      orders: [],
      selectedOrder: null,
      orderItems: [],
      modal: null,
      isAdmin: false
    };
  },
  computed: {
    pendingOrders() {
      return this.orders.filter(order => order.status === 'pending').length;
    },
    shippedOrders() {
      return this.orders.filter(order => order.status === 'ship').length;
    },
    toDeliverOrders() {
      return this.orders.filter(order => order.status === 'delivered').length;
    },
    completedOrders() {
      return this.orders.filter(order => order.status === 'complete').length;
    }
  },
  methods: {
    async checkAdminSession() {
      try {
        const response = await axios.get('http://localhost:5555/admin/check', {
          withCredentials: true
        });
        this.isAdmin = response.data.isAdmin;
        return this.isAdmin;
      } catch (error) {
        console.error('Admin check error:', error);
        this.$router.push('/login');
        return false;
      }
    },

    async fetchOrders() {
      try {
        if (!this.isAdmin) {
          const isAdminUser = await this.checkAdminSession();
          if (!isAdminUser) return;
        }

        console.log('Fetching orders...');
        const response = await axios.get('http://localhost:5555/admin/orders', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.data.success) {
          this.orders = response.data.orders.map(order => ({
            ...order,
            currentStatus: order.status // Keep track of original status
          }));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Error loading orders');
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      }
    },

    async updateStatus(orderId, newStatus) {
      try {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const response = await axios.put(
          `http://localhost:5555/admin/orders/${orderId}/status`,
          { status: newStatus },
          { withCredentials: true }
        );

        if (response.data.success) {
          order.status = newStatus;
          alert('Order status updated successfully');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update order status');
        
        // Revert the status in the dropdown
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          this.$nextTick(() => {
            order.status = order.currentStatus || 'pending';
          });
        }
      }
    },

    async viewDetails(order) {
      try {
        if (!this.isAdmin) {
          const isAdminUser = await this.checkAdminSession();
          if (!isAdminUser) return;
        }

        const response = await axios.get(`http://localhost:5555/admin/orders/${order.id}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          this.selectedOrder = order;
          this.orderItems = response.data.orderDetails.items || [];
          this.modal.show();
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          alert('Failed to fetch order details');
        }
      }
    },
    closeModal() {
      this.modal.hide();
      this.selectedOrder = null;
      this.orderItems = [];
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getStatusBadgeClass(status) {
      const classes = {
        pending: 'badge bg-warning',
        ship: 'badge bg-primary',
        delivered: 'badge bg-info',
        complete: 'badge bg-success',
        cancelled: 'badge bg-danger'
      };
      return classes[status] || 'badge bg-secondary';
    },
    getStatusDisplay(status) {
      const display = {
        pending: 'To Pay',
        ship: 'To Ship',
        delivered: 'To Deliver',
        complete: 'Completed',
        cancelled: 'Cancelled'
      };
      return display[status] || status;
    },
    async handleLogout() {
      try {
        await axios.post("http://localhost:5555/logout", {}, { withCredentials: true });
        localStorage.removeItem("userRole");
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed", error);
        alert("Logout failed");
      }
    }
  },
  async created() {
    const isAdminUser = await this.checkAdminSession();
    if (isAdminUser) {
      this.fetchOrders();
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.orderModal);
    // Fetch orders every minute to keep the list updated
    this.interval = setInterval(() => {
      if (this.isAdmin) {
        this.fetchOrders();
      }
    }, 60000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  position: sticky;
  top: 0;
}

.nav-link {
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: #0d6efd !important;
}

.table th {
  background-color: #f8f9fa;
}

.main-content {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.badge {
  font-size: 0.85em;
  padding: 0.35em 0.65em;
  }
</style>
