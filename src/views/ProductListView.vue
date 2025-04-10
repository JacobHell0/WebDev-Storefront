<template>
    <div class="product-list-view">
      <!-- Sidebar Filters -->
      <aside class="sidebar">
        <h3>Filter By</h3>
  
        <!-- Price Filter -->
        <div class="filter-group">
          <h4>Price</h4>
          <div class="option" :class="{ active: selectedFilters.price === '' }" @click="selectedFilters.price = ''">No Filter</div>
          <div class="option" :class="{ active: selectedFilters.price === 'under10' }" @click="selectedFilters.price = 'under10'">Under $10</div>
          <div class="option" :class="{ active: selectedFilters.price === 'under25' }" @click="selectedFilters.price = 'under25'">Under $25</div>
          <div class="option" :class="{ active: selectedFilters.price === 'under50' }" @click="selectedFilters.price = 'under50'">Under $50</div>
          <div class="option" :class="{ active: selectedFilters.price === 'under100' }" @click="selectedFilters.price = 'under100'">Under $100</div>
        </div>
  
        <!-- Discount Filter -->
        <div class="filter-group">
          <h4>Discount</h4>
          <div class="option" :class="{ active: selectedFilters.discount === '' }" @click="selectedFilters.discount = ''">No Filter</div>
          <div class="option" :class="{ active: selectedFilters.discount === '15' }" @click="selectedFilters.discount = '15'">15% off or more</div>
          <div class="option" :class="{ active: selectedFilters.discount === '25' }" @click="selectedFilters.discount = '25'">25% off or more</div>
          <div class="option" :class="{ active: selectedFilters.discount === '50' }"@click="selectedFilters.discount = '50'">50% off or more</div>
          <div class="option" :class="{ active: selectedFilters.discount === '75' }" @click="selectedFilters.discount = '75'">75% off or more</div>
        </div>
  
        <!-- Rating Filter -->
        <div class="filter-group">
          <h4>Rating</h4>
          <div class="option" :class="{ active: selectedFilters.rating === '' } "@click="selectedFilters.rating = ''">No Filter</div>
          <div class="option" :class="{ active: selectedFilters.rating === '2' } "@click="selectedFilters.rating = '2'">2 stars & up</div>
          <div class="option" :class="{ active: selectedFilters.rating === '3' } "@click="selectedFilters.rating = '3'">3 stars & up</div>
          <div class="option" :class="{ active: selectedFilters.rating === '4' } "@click="selectedFilters.rating = '4'">4 stars & up</div>
        </div>
      </aside>
  
      <!-- Product List -->
      <section class="product-list">
        <button
          class="product-card"
          v-for="product in filteredProducts"
          :key="product.id"
          @click="load_product_page(product.id)"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="rating">{{ product.ratings }} ⭐ ({{ product.no_of_ratings }} Ratings)</p>
          
            <div v-if="product.discount_price && product.discount_price < product.actual_price">
              <div class="discounted-price">
                <span class="discount-percent">
                  -{{ getDiscountPercent(product.actual_price, product.discount_price) }}%
                </span>
                ${{ product.discount_price.toFixed(2) }}
              </div>
              <div class="list-price">List: ${{ product.actual_price.toFixed(2) }}</div>
            </div>
          
            <div class="product-price" v-else>
              ${{ product.actual_price.toFixed(2) }}
            </div>
          </div>
        </button>
      </section>
    </div>
    
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import apiServices from '@/services/apiServices';
  
  const route = useRoute();
  const router = useRouter();
  const products = ref([]);
  const selectedFilters = ref({
    price: '',
    discount: '',
    rating: '',
  });

  const { initialProducts } = defineProps({
    initialProducts: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  });
  
  onMounted(async () => {
    const category = route.params.category;
  
    if (initialProducts.length > 0) {
      products.value = initialProducts;
    } else if (category) {
      try {
        products.value = await apiServices.getByCategory(category);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }
  });
  
  const getDiscountPercent = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };
  
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const price = product.discount_price || product.actual_price;
      const rating = product.ratings || 0;
      const discount = product.discount_price
        ? 100 * (1 - product.discount_price / product.actual_price)
        : 0;
  
      let pass = true;
  
      // Price Filter
      if (selectedFilters.value.price === 'under10') pass = price < 10;
      else if (selectedFilters.value.price === 'under25') pass = price < 25;
      else if (selectedFilters.value.price === 'under50') pass = price < 50;
      else if (selectedFilters.value.price === 'under100') pass = price < 100;
  
      // Discount Filter
      if (selectedFilters.value.discount) {
        pass = pass && discount >= parseInt(selectedFilters.value.discount);
      }
  
      // Rating Filter
      if (selectedFilters.value.rating) {
        pass = pass && rating >= parseInt(selectedFilters.value.rating);
      }
  
      return pass;
    });
  });


  function load_product_page(productId) {
    router.push(`/product/${productId}`);
  }


  
  </script>
  
  <style scoped>
  .product-list-view {
    display: flex;
    padding: 1rem;
  }
  
  .sidebar {
    width: 240px;
    padding: 1rem;
    background-color: #0077CA;
    color: white;
    border-radius: 8px;
    height: 80vh;
    position: fixed;
    top: 80px;
    overflow-y: auto;
    padding-bottom: 4rem;
  }

  .option.active {
    background-color: #00283C;
    color: white;
    font-weight: bold;
  }
  
  .filter-group {
    margin-bottom: 1.5rem;
  }
  
  .option {
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    padding: 6px 12px;
    margin: 4px 0;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .option:hover:not(.active) {
    background-color: #e0e0e0;
  }
  
  .product-list {
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    width: 100%;
  }
  
  .product-card {
  all: unset;
  cursor: pointer;
  display: flex;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.product-card:hover {
  background-color: #f0f0f0;
}

  
  .product-card img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    flex-shrink: 0;
  }
  
  .product-price-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.25rem 0;
  }
  
  .discounted-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
  }
  
  .discount-percent {
    color: red;
    font-weight: bold;
    margin-bottom: 0.2rem;
    font-size: 1.5rem;
  }
  
  .list-price {
    font-size: 1rem;
    color: #555;
    text-decoration: line-through;
  }
  
  .product-price {
    font-weight: bold;
    color: #0077ca;
    margin: 0.25rem;
    font-size: 1.25rem;
  }
  
  .product-name {
    font-size: 1.2rem;
    margin: 0.25rem 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 3.6em;
    color: #0077ca;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .rating {
    font-size: 0.95rem;
    color: #555;
  }
  
  .add-to-cart {
    margin-top: 0.5rem;
    background: #E75D2A;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .add-to-cart:hover {
    background: #005fa3;
  }
  </style>
  