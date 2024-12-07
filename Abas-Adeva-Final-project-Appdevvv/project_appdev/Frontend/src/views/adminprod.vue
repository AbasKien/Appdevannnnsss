<script>
import '../assets/admin.css';
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    // State Variables
    const products = ref([]);
    const tableRef = ref(null);
    const baseUrl = 'http://localhost:5555';

    // Form states
    const newProduct = ref({ name: '', description: '', price: '', image_url: '' });
    const editProduct = ref({ id: 0, name: '', description: '', price: '', quantity: 0, image_url: '' });

    // Modal visibility states
    const showAddProductModal = ref(false);
    const showAddQuantityModal = ref(false);
    const showEditProductModal = ref(false);

    // Selected product and quantity to add
    const selectedProduct = ref(null);
    const quantityToAdd = ref(null);

    // Snackbar state for messages
    const snackbar = ref({ show: false, message: '', color: 'success' });

    // Methods
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        products.value = Array.isArray(response.data.products) ? response.data.products : [];
      } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
      }
    };

    const openEditProductModal = (item) => {
      editProduct.value = { ...item };
      showEditProductModal.value = true;
    };

    const updateProduct = async () => {
      console.log("Product to Update:", editProduct.value); // Debugging log for product data

      if (!editProduct.value || !editProduct.value.id) {
        handleError("Product ID is missing. Cannot update the product.");
        return;
      }

      try {
        const formData = new FormData();
        if (editProduct.value.name) formData.append("name", editProduct.value.name);
        if (editProduct.value.description)
          formData.append("description", editProduct.value.description);
        if (editProduct.value.price) formData.append("price", editProduct.value.price);
        if (editProduct.value.image_url instanceof File)
          formData.append("image", editProduct.value.image_url);

        // Make the PUT request
        const response = await axios.put(
          `${baseUrl}/products/${editProduct.value.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200 && response.data.success) {
          const successMessage = response.data.message || "Product updated successfully!";
          handleResponse(response, successMessage);

        } else {
          // Handle unexpected responses
          const errorMessage =
            response.data && response.data.message
              ? response.data.message
              : "Unexpected response from the server.";
          handleError(errorMessage);
        }
      } catch (error) {
        console.error("Error updating product:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Failed to update product. Please try again.";
        handleError(errorMessage);
      } finally {
        // Ensure the modal is closed after submission
        const modalElement = document.getElementById("editProductModal");
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }
        // Reset the `showEditProductModal` state (if necessary)
        showEditProductModal.value = false;
      }
    };

    const addProduct = async () => {
      console.log('Product to Add:', newProduct.value); // Debugging log for product data

      const formData = new FormData();
      formData.append('name', newProduct.value.name);
      formData.append('description', newProduct.value.description);
      formData.append('price', newProduct.value.price);
      formData.append('image', newProduct.value.image_url);

      try {
        // Make the POST request
        const response = await axios.post(`${baseUrl}/add-product`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const successMessage = response.data.message || 'Product added successfully!';
        handleResponse(response, successMessage);

        // Reset the form and clear the file input
        resetNewProductForm();
      } catch (error) {
        // Improved error handling to show specific error messages
        console.error('Error adding product:', error);

        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'An error occurred while adding the product. Please try again.';

        handleError(errorMessage);
      } finally {
        // Ensure the modal is closed after submission
        const modalElement = document.getElementById('addProductModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();
        }

        // Reset the `showAddProductModal` state (if needed)
        showAddProductModal.value = false;

        // Explicitly reset the file input field
        resetFileInput();
      }
    };
    // Helper function to reset the file input
    const resetFileInput = () => {
      const fileInput = document.getElementById('productImage');
      if (fileInput) {
        fileInput.value = ''; // Clear the file input value
      }
    };

    const openAddQuantityModal = (item) => {
      selectedProduct.value = item;
      quantityToAdd.value = null;
      showAddQuantityModal.value = true;
    };

    const addQuantity = async () => {
      console.log('Quantity to Add:', quantityToAdd.value); // Debugging line
      if (!selectedProduct.value || quantityToAdd.value === null) return;

      try {
        const response = await axios.patch(`${baseUrl}/products/${selectedProduct.value.id}/quantity`, {
          quantity: quantityToAdd.value,
        });

        const successMessage = response.data.message || `Quantity added successfully to ${selectedProduct.value.name}!`;
        handleResponse(response, successMessage);

        const modalElement = document.getElementById('addQuantityModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
        }
        selectedProduct.value = null;
      } catch (error) {
        console.error('Error adding quantity:', error);

        const errorMessage = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Error adding quantity';

        handleError(errorMessage);

        const modalElement = document.getElementById('addQuantityModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
        }
        selectedProduct.value = null;
      }
    };

    const handleFileChange = (event, productType) => {
      const file = event.target.files[0];
      if (file) {
        if (productType === 'newProduct') {
          newProduct.value.image_url = file;
        } else if (productType === 'editProduct') {
          editProduct.value.image_url = file;
        }
      }
    };

    const handleLogout = async () => {
      try {
        console.log("Logging out...");
        await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
        localStorage.removeItem("userRole");
        window.location.href = "/login"; // Redirecting to login page after logout
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    const handleResponse = (response, successMessage) => {
      if (response.data.success) {
        snackbar.value = { show: true, message: successMessage, color: 'success' };
        fetchProducts();

        setTimeout(() => {
          snackbar.value.show = false;
        }, 3000);
      } else {
        snackbar.value = { show: true, message: response.data.message || 'Operation failed', color: 'danger' };

        setTimeout(() => {
          snackbar.value.show = false;
        }, 3000);
      }
    };

    const handleError = (message) => {
      snackbar.value = { show: true, message, color: 'danger' };

      setTimeout(() => {
        snackbar.value.show = false;
      }, 3000);
    };

    const createFormData = (productData) => {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'image_url' && productData[key] instanceof File) {
          formData.append('image', productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });
      return formData;
    };

    const resetNewProductForm = () => {
      newProduct.value = { name: '', description: '', price: '', image_url: '' };
    };

    const loadDataTables = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css';
      document.head.appendChild(link);

      const scriptJQuery = document.createElement('script');
      scriptJQuery.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      scriptJQuery.onload = () => initDataTable();
      document.head.appendChild(scriptJQuery);
    };

    const initDataTable = () => {
      const scriptDataTable = document.createElement('script');
      scriptDataTable.src = 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js';
      scriptDataTable.onload = () => {
        if (tableRef.value) {
          $(tableRef.value).DataTable();
        }
      };
      document.head.appendChild(scriptDataTable);
    };

    onMounted(() => {
      fetchProducts();
      loadDataTables();
    });

    return {
      products, tableRef, baseUrl, newProduct, showAddProductModal, showAddQuantityModal,
      selectedProduct, quantityToAdd, snackbar, showEditProductModal, editProduct,
      openEditProductModal, updateProduct, addProduct, openAddQuantityModal, addQuantity, handleFileChange,handleLogout
    };

  }
  
  
};
</script>


<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <nav class="sidebar bg-dark text-white vh-100 p-3">
      <h4 class="text-white mb-4">Admin Dashboard</h4>
      <ul class="nav flex-column">
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
    <div class="main-content flex-grow-1 p-4">
      <!-- Snackbar -->
      <div v-if="snackbar.show" class="alert" :class="'alert-' + snackbar.color">
        {{ snackbar.message }}
      </div>
      <div class="container">
        <h2 class="mb-4">Product List</h2>

        <!-- Product Table Card -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Product Table</h5>
            <!-- Check for button visibility -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">Add
              Product</button>

          </div>
          <div class="card-body">
            <!-- Table -->
            <table ref="tableRef" class="table table-bordered table-hover table-sm table-striped">
              <thead>
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">Name</th>
                  <th class="text-center">Description</th>
                  <th class="text-center">Price</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-center">Image</th>
                  <th class="text-center">Stock</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products" :key="item.id">
                  <td class="text-center">{{ item.id }}</td>
                  <td class="text-center">{{ item.name }}</td>
                  <td class="text-center">{{ item.description }}</td>
                  <td class="text-center">{{ item.price }}</td>
                  <td class="text-center">{{ item.stock }}</td>
                  <td class="text-center">
                    <img :src="baseUrl + item.image_url" class="img-fluid" alt="Product Image"
                      style="height: 50px; object-fit: cover;">
                  </td>
                  <td class="text-center">
                    <span :class="item.stock > 0 ? 'badge bg-success' : 'badge bg-danger'">
                      {{ item.stock > 0 ? 'In stock' : 'Out of stock' }}
                    </span>
                  </td>
                  <td class="text-center">
                    <button @click="openAddQuantityModal(item)" class="btn btn-success me-2" data-bs-toggle="modal"
                      data-bs-target="#addQuantityModal">
                      <i class="fas fa-plus"></i>
                    </button>
                    <button @click="openEditProductModal(item)" class="btn btn-info" data-bs-toggle="modal"
                      data-bs-target="#editProductModal">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Product Modal -->
  <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addProductModalLabel">Add New Product</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addProduct">
            <div class="mb-3">
              <label for="productName" class="form-label">Product Name</label>
              <input type="text" id="productName" class="form-control" v-model="newProduct.name" required>
            </div>
            <div class="mb-3">
              <label for="productDescription" class="form-label">Description</label>
              <input type="text" id="productDescription" class="form-control" v-model="newProduct.description" required>
            </div>
            <div class="mb-3">
              <label for="productPrice" class="form-label">Price</label>
              <input type="number" id="productPrice" class="form-control" v-model="newProduct.price" required>
            </div>
            <div class="mb-3">
              <label for="productImage" class="form-label">Upload Image</label>
              <input type="file" id="productImage" class="form-control" accept="image/*"
                @change="handleFileChange($event, 'newProduct')">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Product Modal -->
  <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateProduct">
            <div class="mb-3">
              <label for="editProductName" class="form-label">Product Name</label>
              <input type="text" id="editProductName" class="form-control" v-model="editProduct.name" required>
            </div>
            <div class="mb-3">
              <label for="editProductDescription" class="form-label">Description</label>
              <input type="text" id="editProductDescription" class="form-control" v-model="editProduct.description"
                required>
            </div>
            <div class="mb-3">
              <label for="editProductPrice" class="form-label">Price</label>
              <input type="number" id="editProductPrice" class="form-control" v-model="editProduct.price" required>
            </div>
            <div class="mb-3">
              <label for="editProductImage" class="form-label">Upload Image</label>
              <input type="file" id="editProductImage" class="form-control" accept="image/*"
                @change="handleFileChange($event, 'editProduct')">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Quantity Modal -->
  <div class="modal fade" id="addQuantityModal" tabindex="-1" aria-labelledby="addQuantityModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addQuantityModalLabel">
            Adding quantity to {{ selectedProduct ? selectedProduct.name : 'Product' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addQuantity">
            <div class="mb-3">
              <label for="quantityInput" class="form-label">Quantity</label>
              <input type="number" id="quantityInput" class="form-control" v-model="quantityToAdd" required>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Quantity</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
