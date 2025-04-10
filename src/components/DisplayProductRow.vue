<template>
    <div class="product-row-wrapper">
      <h2 v-if="title" class="row-title">{{ title }}</h2>
      
      <!-- Scrollable container with left/right arrows -->
      <div class="row-scroll-container">
        <!-- Scroll left button -->
        <button class="scroll-btn" @click="scrollLeft">
            <img :src="arrowLeft" alt="Scroll Left" class="arrow-img" />
        </button>
        
        <!-- Scrollable row of product cards -->
        <div class="product-row" ref="scrollContainer">
          <button
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="load_product_page(product.id)"
          >
            <img :src="product.image" :alt="product.name" class="product-image" />
            
            <h3 class="product-name">{{ product.name }}</h3>
            <div v-if="product.no_of_ratings > 1" class="product-rating">
               {{ product.ratings }} ⭐ (From {{ product.no_of_ratings }} Ratings)
            </div>
            <div v-else class="product-rating">
               {{ product.ratings }} ⭐ (From {{ product.no_of_ratings }} Rating)
            </div>

            <!-- Discounted Price -->
            <div class="product-price-container" v-if="product.discount_price && product.discount_price < product.actual_price">
                
                <span class="discounted-price">
                    <span class="discount-percent">
                    -{{ getDiscountPercent(product.actual_price, product.discount_price) }}%
                    </span>
                    ${{ product.discount_price.toFixed(2) }}</span>
                <div class="list-price">List: ${{ product.actual_price.toFixed(2) }}</div>
            </div>

            <!-- Regular Price -->
            <div class="product-price" v-else>
                ${{ product.actual_price.toFixed(2) }}
            </div>
          </button>
        </div>

         <!-- Scroll right button -->
        <button class="scroll-btn" @click="scrollRight">
            <img :src="arrowRight" alt="Scroll Right" class="arrow-img" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import apiServices from '@/services/apiServices';
  import arrowRight from '@/assets/arrow_right.png';
  import arrowLeft from '@/assets/arrow_left.png';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // Props for the row: source (category or "rating") and optional title
  const props = defineProps({
    source: {type: String, required: true},
    title: {type: String, default: ''}
  });

  const products = ref([]);
  const scrollContainer = ref(null);

  // Load products either by category or by ratin
  const loadProducts = async () => {
    try {
      if (props.source === 'rating') {
        products.value = await apiServices.getSortedByRating();
      } else {
        products.value = await apiServices.getByCategory(props.source);
      }
    } catch (error) {
      console.error(`Error loading products for source: ${props.source}`, error);
    }
  };

  onMounted(() => {
    loadProducts();
  });

  function load_product_page(productId) {
    router.push(`/product/${productId}`);
  }
  
  
  function scrollLeft() {
    scrollContainer.value.scrollBy({ left: -708, behavior: 'smooth' });
  }
  
  function scrollRight() {
    scrollContainer.value.scrollBy({ left: 708, behavior: 'smooth' });
  }

  function getDiscountPercent(original, discounted) {
    return Math.max(1, Math.round((1 - discounted / original) * 100))

}
  </script>
  
  <style scoped>
  .product-row-wrapper {
    padding: 1rem;
    background-color: white;
  }
  
  .row-title {
    margin-bottom: 0.5rem;
    color: #003C71;
    font-weight: bold;
  }
  
  .row-scroll-container {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  
  .scroll-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 0 0.5rem;
    color: #0077CA;
  }
  
  .product-row {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 1rem;
  }

  .product-row::-webkit-scrollbar {
    display: none;
  }
  
  .product-card {
    min-width: 220px;
    max-width: 220px;
    padding: 0.75rem;
    border: 1px solid #e8e6e6;
    border-radius: 6px;
    background-color: white;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 280px;
  }

  .product-card:hover {
    background-color: #f0f0f0;
  }
  
  .product-image {
    width: 100%;
    height: 120px;
    object-fit: contain;
    margin-bottom: 0.5rem;
    background-color: white;
    border-radius: 4px;
  }
  
  .product-price {
    font-weight: bold;
    color: #000000;
    margin: 0.25rem;
    font-size: 1.25rem;
  }
  
  .product-card h3 {
    font-size: 0.95rem;
    margin: 0.25rem 0;
    line-height: 1.2;
    display: -webkit-box;
    line-clamp: 3;
    box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 3.6em;
  }
  
  .product-rating {
    font-size: 0.85rem;
    color: #555;
  }
  
  .product-name {
      color: #0077CA;
  }
  
  .product-price-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.25rem 0;
  }
  
  .discounted-price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #000;
  }
  
  .discount-percent {
    color: red;
    font-weight: bold;
    margin-bottom: 0.2rem;
    font-size: 1.25rem;
  }
  
  .list-price {
    font-size: 0.8rem;
    color: #555;
    text-decoration: line-through;
  }
  
  .arrow-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    transition: transform 0.2s ease;
  }
  
  .scroll-btn:hover .arrow-img {
    transform: scale(1.1);
  }

</style>  