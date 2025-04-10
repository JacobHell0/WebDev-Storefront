<template>
  <div class="product-page">
    <div class="product-container">
      <div class="product-image-container">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </div>
      
      <div class="product-details">
        <h1 class="product-name">{{ product.name }}</h1>
        
        <div class="product-categories">
          <p>Category: {{ product.main_category }}</p>
          <p>Subcategory: {{ product.sub_category }}</p>
        </div>

        <div class="product-rating">
          <span class="rating-stars">{{ product.ratings }} ⭐</span>
          <span v-if="product.no_of_ratings > 1 || product.no_of_ratings === 0" class="rating-count">(From {{ product.no_of_ratings }} ratings)</span>
          <span v-else class="rating-count">(From {{ product.no_of_ratings }} rating)</span>
        </div>

        <!-- If discount_price is not NaN, make it green and cross out original price, show discount % | else make original price green -->
        <div class="product-price">
          <div class="price-quantity-container">
            <div class="price-row">
                <span v-if="product.discount_price !== null" class="current-price">${{ product.discount_price?.toFixed(2) }}</span>
                <span v-if="product.discount_price !== null" class="discount-percent">-{{ Math.round((1 - product.discount_price/product.actual_price) * 100) }}%</span>
                <span v-else class="current-price">${{ product.actual_price?.toFixed(2) }}</span>
            </div>
            <div class="quantity-selector">
              <button class="quantity-btnm" @click="decrementQuantity">−</button>
              <input type="text" class="quantity-input" :value="quantity" readonly>
              <button class="quantity-btnp" @click="incrementQuantity">+</button>
            </div>
          </div>
          <span v-if="product.discount_price !== null" class="original-price">List: ${{ product.actual_price?.toFixed(2) }}</span>
        </div>
        
        <div class="buttons-container">
            <a :href="product.link" class="amazon-link">
                View on Amazon
            </a>
            <button class="cart-button" @click="addToCart">
                <span class="cart-icon">🛒</span>
                Add to Cart
            </button>
        </div>

        <!-- Maybe temporary -->
        <div class="rating-distribution">
          <h3>Ratings Chart</h3>
          <div ref="chartContainer" class="chart-container"></div>
        </div>  

      </div>
    </div>
    <div class="suggested-products-container">
        <h3>Suggested Products</h3>
        <div class="suggested-products-grid">
            <!-- Each card just navigates to home page for now -->
            <router-link v-for="product in suggestedProducts" :key="product.name" :to="`/product/${product.id}`" class="suggested-product-card">
                <img :src="product.image" :alt="product.name" class="suggested-product-image">
                <div class="suggested-product-details">
                    <div class="suggested-product-name">{{ product.name }}</div>
                    <div class="suggested-product-price">
                        <div class="product-price">
                            <!-- Same logic as earlier but in the cards -->
                            <div class="price-row">
                                <span v-if="product.discount_price !== null" class="suggested-current-price">${{ product.discount_price?.toFixed(2) }}</span>
                                <span v-if="product.discount_price !== null" class="suggested-discount-percent">-{{ Math.round((1 - product.discount_price/product.actual_price) * 100) }}%</span>
                                <span v-else class="suggested-current-price">${{ product.actual_price?.toFixed(2) }}</span>
                            </div>
                            <span v-if="product.discount_price !== null" class="suggested-original-price">List: ${{ product.actual_price?.toFixed(2) }}</span>
                        </div>
                        <div class="suggested-rating">{{ product.ratings }} ⭐</div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
  </div>
  
  <!-- Toast Notification -->
  <Transition name="toast">
    <div v-if="showToast" class="toast">
      <span class="toast-icon">✓</span>
      Item added to cart | quantity: {{ quantity }}
    </div>
  </Transition>
</template>


<script setup>

import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/apiServices';
import { useRoute } from 'vue-router';

// Function to get random items from array
const RandomlyChooseSuggested = (products, count = 4) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const route = useRoute();
let product = ref({});
let suggestedProducts = ref([]);

const loadProduct = async () => {
  try {
    const productId = route.params.id;
    product.value = await apiServices.getProduct(productId);

    if (product.value.no_of_ratings === null) {
      product.value.no_of_ratings = 0;
    }
    
    if (product.value.main_category) {
      const sharedCategoryProducts = await apiServices.getByCategory(product.value.main_category);
      const filteredProducts = sharedCategoryProducts.filter(p => p.id !== route.params.id);
      
      if (filteredProducts.length > 4) {
        suggestedProducts.value = RandomlyChooseSuggested(filteredProducts);
      } else {
        suggestedProducts.value = filteredProducts;
      }
    }
  } catch (error) {
    console.error('Error loading product:', error);
  }
};

// Watch for route changes
watch(
  () => route.params.id,
  async (suggestedId) => {
    if (suggestedId) {
      await loadProduct();
      updateChart();
    }
  }
);

onMounted(async () => {
  await loadProduct();
  updateChart();
});


// this is temporary maybe all AI generated
import * as d3 from 'd3';

const chartContainer = ref(null);
let svg = null;

// Function to calculate rating distribution
function calculateRatingDistribution(averageRating, totalRatings) {
  // Calculate total points needed
  const totalPoints = Math.round(averageRating * totalRatings);
  
  // Initialize distribution
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  
  // Start with the highest possible ratings
  let remainingPoints = totalPoints;
  let remainingRatings = totalRatings;
  
  // Distribute 5-star ratings
  distribution[5] = Math.min(
    Math.floor(remainingPoints / 5),
    remainingRatings
  );
  remainingPoints -= distribution[5] * 5;
  remainingRatings -= distribution[5];
  
  // Distribute 4-star ratings
  if (remainingRatings > 0) {
    distribution[4] = Math.min(
      Math.floor(remainingPoints / 4),
      remainingRatings
    );
    remainingPoints -= distribution[4] * 4;
    remainingRatings -= distribution[4];
  }
  
  // Distribute 3-star ratings
  if (remainingRatings > 0) {
    distribution[3] = Math.min(
      Math.floor(remainingPoints / 3),
      remainingRatings
    );
    remainingPoints -= distribution[3] * 3;
    remainingRatings -= distribution[3];
  }
  
  // Distribute 2-star ratings
  if (remainingRatings > 0) {
    distribution[2] = Math.min(
      Math.floor(remainingPoints / 2),
      remainingRatings
    );
    remainingPoints -= distribution[2] * 2;
    remainingRatings -= distribution[2];
  }
  
  // Remaining ratings are 1-star
  distribution[1] = remainingRatings;
  
  // Convert to array format for D3
  return Object.entries(distribution).map(([rating, count]) => ({
    rating: parseInt(rating),
    count: count
  })).sort((a, b) => b.rating - a.rating);
}

// Function to create/update the chart
function updateChart() {
  if (!chartContainer.value) return;

  // Clear existing chart
  d3.select(chartContainer.value).selectAll("*").remove();
  
  // Calculate rating distribution
  const ratingData = calculateRatingDistribution(product.value.ratings, product.value.no_of_ratings);


  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom
  
  svg = d3.select(chartContainer.value).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const x = d3.scaleLinear()
    .domain([0, d3.max(ratingData, d => d.count)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(ratingData.map(d => d.rating))
    .range([0, height])
    .padding(0.1);
    
  svg.selectAll('rect')
    .data(ratingData)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d => y(d.rating))
    .attr('width', d => x(d.count))
    .attr('height', y.bandwidth())
    .attr('fill', '#FFA41C')
    .attr('rx', 4)
    .attr('ry', 4);

    svg.selectAll('.count-label')
    .data(ratingData)
    .enter()
    .append('text')
    .attr('class', 'count-label')
    .attr('x', d => x(d.count) + 5)
    .attr('y', d => y(d.rating) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(d => d.count)
    .style('font-size', '12px')
    .style('fill', '#666');

    svg.selectAll('.rating-label')
    .data(ratingData)
    .enter()
    .append('text')
    .attr('class', 'rating-label')
    .attr('x', -20)
    .attr('y', d => y(d.rating) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(d => `${d.rating} ★`)
    .style('font-size', '12px')
    .style('text-anchor', 'end')
    .style('fill', '#666');

  // Add axes
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5))
    .style('font-size', '10px')
    .style('color', '#666');

  svg.append('g')
    .call(d3.axisLeft(y))
    .style('font-size', '10px')
    .style('color', '#666');
}

const quantity = ref(1);

const incrementQuantity = () => {
  if (quantity.value < 30) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const showToast = ref(false);

const addToCart = () => {
  console.log(`Logging to send to cart page\nAdding ${quantity.value} items to cart\nProduct ID: ${product.value.id}`);
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 4000); // Hide after 3 seconds
};

</script>


<style scoped>
.product-page {
    display: grid;
    grid-template-columns: 80% 20%;
    gap: 2rem;
    padding: 30px;
    max-width: 100%;
    margin-right: 3%;
    margin-left: 2%;
}

.product-container {
  display: grid;
  grid-template-columns: 50% 50%;
  padding-top: 2rem;
  margin-right: 7%;
  gap: 2%
}

.product-image-container {
    padding: 8%;
    margin-left: 23%;
  display: flex;
  justify-content: center;
  /* background-color: #f5f5f5; */
  border-radius: 10%;
}

.product-image {
    max-width: 100%;
    max-height: auto;
    object-fit: contain;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 1.9rem;
  padding: 20px;
}

.product-name {
  font-size: 1.8rem;
  color: black;
  font-weight: bold;
}

.product-rating {
    display: flex;
    align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  color: #f0c380;
  font-size: 1.2rem;
  font-weight: bold;
}

.rating-count {
  color: #666;
}

.product-price {
    margin-bottom: 1rem;
}

.price-stack {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.price-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.current-price {
    font-size: 2rem;
    font-weight: bold;
    color: #2E8B57;
}

.discount-percent {
    color: #DC143C;
    font-weight: bold;
    font-size: 1.3rem;
}

.original-price {
    color: #666;
    text-decoration: line-through;
    font-size: 1rem;
}

.product-categories {
  color: #666;
}

.rating-distribution {
  margin-top: 1rem;
}

.rating-distribution h3 {
  display: flex;
  justify-content: center;
  color: #333;
}

.chart-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200px;
}

.buttons-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.amazon-link {
    padding: 0.8rem 1.5rem;
    background-color: #FFD814;
    color: #111;
    border-radius: 4px;
    font-weight: bold;
    text-align: center;
}

.cart-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #cdeaff;
    color: #1976D2;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.cart-icon {
    font-size: 1.2rem;
}

.amazon-link:hover {
    background-color: #F7CA00;
}

.cart-button:hover {
    background-color: #BBDEFB;
}

.suggested-products-container {
    /* border: 1px solid black; */
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.suggested-products-container h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: black;
    font-weight: bold;
    font-size: 1.5rem;
    /* text-decoration: underline; */
}

.suggested-products-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.suggested-product-card {
    display: flex;
    gap: 1rem;
    padding: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 1px 1px 2px 2px rgba(0,0,0,0.1);
    align-items: center;
    color: black;
    transition: all 0.2s ease;
    cursor: pointer;
}

.suggested-product-card:hover {
    background-color: #f8f9fa;
}

.suggested-product-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
}

.suggested-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 20px;
}

.suggested-product-name {
    font-size: 0.9rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.suggested-product-price {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.suggested-price-stack {
    display: flex;
    flex-direction: column;
}

.suggested-current-price {
    font-size: 1rem;
    font-weight: bold;
    color: #2E8B57;
}

.suggested-discount-percent {
    color: #DC143C;
    font-size: 0.9rem;
}

.suggested-original-price {
    font-size: 0.8rem;
    color: #666;
    text-decoration: line-through;
}

.suggested-rating {
    color: #f0c380;;
    font-weight: bold;
}

.price-quantity-container {
  display: flex;
  align-items: end;
  gap: 2.2rem;
}

.quantity-selector {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.quantity-btnp {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: none;
  border-radius: 4px;
  border-left: 1px solid #ddd;
  cursor: pointer;
  font-size: 1.2rem;
  color: #1976D2;
}

.quantity-btnm {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: none;
  border-radius: 4px;
  border-right: 1px solid #ddd;
  cursor: pointer;
  font-size: 1.2rem;
  color: #1976D2;
}

.quantity-btnp:hover {
  background-color: #e9ecef;
}

.quantity-btnm:hover {
  background-color: #e9ecef;
}

.quantity-input {
  width: 45px;
  text-align: center;
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: default;
}

.quantity-input:focus {
  outline: none;
}

.toast {
  position: fixed;
  top: 10%;
  left: 55%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.toast-icon {
  font-weight: bold;
}

/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style> 