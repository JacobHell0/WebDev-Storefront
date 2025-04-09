<script setup>
</script>

<template>
  <main class="home-page">
    <!-- Toolbar under header -->
    <div class="home-toolbar">
      <button>Buy Again</button>
      <button>Deals</button>
      <button>Browsing History</button>

      <!-- Price filter dropdown -->
      <div class="filter-group">
        <select id="price-filter">
          <option>Price</option>
          <option value="under25">Under $25</option>
          <option value="under50">Under $50</option>
        </select>
      </div>

      <!-- Discount filter dropdown -->
      <div class="filter-group">
        <select id="discount-filter">
          <option>Discount</option>
          <option value="10">10% off or more</option>
          <option value="20">20% off or more</option>
          <option value="50">50% off or more</option>
        </select>
      </div>

      <!-- Rating filter dropdown -->
      <div class="filter-group">
        <select id="rating-filter">
          <option>Rating</option>
          <option value="4up">4 stars & up</option>
          <option value="3up">3 stars & up</option>
        </select>
      </div>
    </div>
  </main>
</template>


<style scoped>
.home-toolbar {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  background-color: #0077CA;
  color: white;
}

.home-toolbar button {
  background-color: white;
  color: #0077CA;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}

.home-toolbar button:hover {
  background-color: #e0e0e0;
}

.filter-group select {
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  color: #0077CA;
}
</style>