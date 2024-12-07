import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'

// src/main.js or src/main.ts
import 'bootstrap/dist/css/bootstrap.min.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5555'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add axios request interceptor
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Add axios response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

const app = createApp(App)
app.use(router)
app.mount('#app')
