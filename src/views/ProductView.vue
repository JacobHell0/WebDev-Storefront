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
            <span class="rating-stars">{{ product.ratings }} ★</span>
            <span class="rating-count">({{ product.no_of_ratings }} ratings)</span>
          </div>
  
          <!-- If discount_price is not NaN, make it green and cross out original price, show discount % | else make original price green -->
          <div class="product-price">
              <div class="price-row">
                  <span v-if="!isNaN(product.discount_price)" class="current-price">${{ product.discount_price.toFixed(2) }}</span>
                  <span v-if="!isNaN(product.discount_price)" class="discount-percent">-{{ Math.round((1 - product.discount_price/product.actual_price) * 100) }}%</span>
                  <span v-else class="current-price">${{ product.actual_price.toFixed(2) }}</span>
              </div>
              <span v-if="!isNaN(product.discount_price)" class="original-price">${{ product.actual_price.toFixed(2) }}</span>
          </div>
          
          <div class="buttons-container">
              <a :href="product.link" class="amazon-link">
                  View on Amazon
              </a>
              <button class="cart-button">
                  <span class="cart-icon">🛒</span>
                  Add to Cart
              </button>
          </div>
  
          <!-- Maybe temporary -->
          <div class="rating-distribution">
            <h3>Rating Distribution</h3>
            <div ref="chartContainer" class="chart-container"></div>
          </div>  
  
        </div>
      </div>
      <div class="suggested-products-container">
          <h3>Suggested Products</h3>
          <div class="suggested-products-grid">
              <!-- Each card just navigates to home page for now -->
              <router-link v-for="product in suggestedProducts" :key="product.name" to="/"class="suggested-product-card">
                  <img :src="product.image" :alt="product.name" class="suggested-product-image">
                  <div class="suggested-product-details">
                      <div class="suggested-product-name">{{ product.name }}</div>
                      <div class="suggested-product-price">
                          <div class="product-price">
                              <!-- Same logic as earlier but in the cards -->
                              <div class="price-row">
                                  <span v-if="!isNaN(product.discount_price)" class="suggested-current-price">${{ product.discount_price.toFixed(2) }}</span>
                                  <span v-if="!isNaN(product.discount_price)" class="suggested-discount-percent">-{{ Math.round((1 - product.discount_price/product.actual_price) * 100) }}%</span>
                                  <span v-else class="suggested-current-price">${{ product.actual_price.toFixed(2) }}</span>
                              </div>
                              <span v-if="!isNaN(product.discount_price)" class="suggested-original-price">${{ product.actual_price.toFixed(2) }}</span>
                          </div>
                          <div class="suggested-rating">{{ product.ratings }} ★</div>
                      </div>
                  </div>
              </router-link>
          </div>
      </div>
    </div>
</template>


<script setup>
  
  // temp hardcoded values
  const product = {
      actual_price: 1215.84,
          discount_price: 743.84,
          image: "https://m.media-amazon.com/images/I/51JFb7FctDL._AC_UL320_.jpg",
          link: "https://www.amazon.in/LG-Convertible-Anti-Virus-Protection-RS-Q19YNZE/dp/B0BQ3MXML8/ref=sr_1_5?qid=1679134237&s=kitchen&sr=1-5",
          main_category: "appliances",
          name: "LG 1.5 Ton 5 Star AI DUAL Inverter Split AC (Copper, Super Convertible 6-in-1 Cooling, HD Filter with Anti-Virus Protectio...",
          no_of_ratings: 2,
          ratings: 4.2,
          sub_category: "Air Conditioners"
  };
  
  const suggestedProducts = [
      {
          actual_price: 2.72,
          discount_price: 2.592,
          image: "https://m.media-amazon.com/images/I/61rBhkTJ6EL._AC_UL320_.jpg",
          link: "https://www.amazon.in/Sugarfree-Green-100-Natural-Stevia/dp/B082TC6KL9/ref=sr_1_699?qid=1679216185&s=grocery&sr=1-699",
          main_category: "grocery & gourmet foods",
          name: "Sugar Free Green Natural Stevia Jar(200 g)",
          no_of_ratings: 1,
          ratings: 4.3,
          sub_category: "All Grocery & Gourmet Foods"
      },
      {
          actual_price: 1215.84,
          discount_price: 743.84,
          image: "https://m.media-amazon.com/images/I/51JFb7FctDL._AC_UL320_.jpg",
          link: "https://www.amazon.in/LG-Convertible-Anti-Virus-Protection-RS-Q19YNZE/dp/B0BQ3MXML8/ref=sr_1_5?qid=1679134237&s=kitchen&sr=1-5",
          main_category: "appliances",
          name: "LG 1.5 Ton 5 Star AI DUAL Inverter Split AC (Copper, Super Convertible 6-in-1 Cooling, HD Filter with Anti-Virus Protectio...",
          no_of_ratings: 2,
          ratings: 4.2,
          sub_category: "Air Conditioners"
      },
      {
          actual_price: 8.72,
          discount_price: 3.184,
          image: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/51RXzjrUmkL._AC_UL320_.jpg",
          link: "https://www.amazon.in/Pigeon-Stovekraft-Plastic-Chopper-Blades/dp/B01LWYDEQ7/ref=sr_1_2?qid=1679135585&s=appliances&sr=1-2",
          main_category: "appliances",
          name: "Pigeon Polypropylene Mini Handy and Compact Chopper with 3 Blades for Effortlessly Chopping Vegetables and Fruits for Your...",
          no_of_ratings: 274,
          ratings: 4.1,
          sub_category: "All Appliances"
      },
  ];
  
  
  // this is temporary maybe all AI generated
  import { ref, onMounted} from 'vue';
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
    const ratingData = calculateRatingDistribution(product.ratings, product.no_of_ratings);
  
    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
  
    // Create SVG
    svg = d3.select(chartContainer.value)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(ratingData, d => d.count)])
      .range([0, width]);
  
    // Y scale
    const y = d3.scaleBand()
      .domain(ratingData.map(d => d.rating))
      .range([0, height])
      .padding(0.1);
  
    // Add bars
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
  
    // Add count labels
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
  
    // Add rating labels
    svg.selectAll('.rating-label')
      .data(ratingData)
      .enter()
      .append('text')
      .attr('class', 'rating-label')
      .attr('x', -5)
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
  
  onMounted(() => {
    updateChart();
  });
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
    color: #FFA41C;
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
    margin-bottom: 1rem;
    color: #333;
  }
  
  .chart-container {
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
      color: #FFA41C;
      font-weight: bold;
  }
</style> 