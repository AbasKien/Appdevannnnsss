<template>
    <div>
      <h2>Order Status Summary</h2>
      <BarChart :chart-data="chartData" :chart-options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  import axios from 'axios';
  
  // Register Chart.js components
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    components: {
      BarChart: Bar,
    },
    data() {
      return {
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Order Count',
              backgroundColor: '#42A5F5',
              data: [],
            },
          ],
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
        },
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:3000/api/orders-summary');
          const labels = response.data.map(item => item.status);
          const data = response.data.map(item => item.count);
  
          this.chartData.labels = labels;
          this.chartData.datasets[0].data = data;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
    },
    mounted() {
      this.fetchData();
    },
  };
  </script>
  
  <style>
  /* Add styles for the chart if needed */
  </style>
  