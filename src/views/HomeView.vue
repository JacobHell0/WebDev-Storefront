<script setup>
</script>

<template>
  <main class="home-page">

    <!-- Toolbar under header -->
   <div class="home-toolbar-fixed">   
    <div class="home-toolbar-wrapper">
     <div class="home-toolbar">

      <!-- Buy Again button -->
      <button @click="loadOrderHistory">Buy Again</button>

      <!-- Category Dropdown -->
      <div class="category-dropdown">
        <select v-model="selectedCategory" @change="goToCategory">
          <option disabled value="">Search by Category</option>
          <option v-for="category in mainCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
     </div>
    </div> 
  </div>

  <div class="toolbar-spacer"></div>

  <!-- Static DisplayProductRow for top rated products -->
    <DisplayProductRow
      source = "rating"
      title = "Top Rated Picks:"
    />

  <!-- Dynamic DisplayProductRow for shuffled categories -->
    <DisplayProductRow
      v-for="category in randomCategories"
      :key="category"
      :source="category"
      :title="category.charAt(0).toUpperCase() + category.slice(1) + ':'"
    />

  </main>
</template>

<script setup>
import DisplayProductRow from '@/components/DisplayProductRow.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiServices from '@/services/apiServices';
import { getAuth } from 'firebase/auth';

const router = useRouter();
const selectedCategory = ref('');
const mainCategories = ref([]);
const randomCategories = ref([]);

// Load all categories when mounted
onMounted(async () => {
  try {
    const categories = await apiServices.getUniqueCategories();
    mainCategories.value = categories;
    shuffleRandomCategories(categories);

  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});

// Shuffle and pick 10 random categories
function shuffleRandomCategories(categories) {
  const shuffled = categories.sort(() => 0.5 - Math.random());
  randomCategories.value = shuffled.slice(0, 10);
}

// Buy Again: Get user's previous order history
async function loadOrderHistory() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('Please log in to view your order history.');
    return;
  }

  try {
    const result = await apiServices.getOrderHistory(user.uid);
    const flatProducts = result.flat();
    const uniqueProducts = Object.values(
      flatProducts.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {})
    );

    router.push({
      name: 'ProductListView',
      query: {
        data: JSON.stringify(uniqueProducts),
        title: 'Buy Again'
      }
    });
  } catch (err) {
    console.error('Failed to fetch order history:', err);
  }
}

// Fetch and show category-based product list
async function goToCategory() {
  if (!selectedCategory.value) return;

  try {
    const result = await apiServices.getByCategory(selectedCategory.value);
    router.push({
      name: 'ProductListView',
      query: {
        data: JSON.stringify(result),
        title: selectedCategory.value
      }
    });
  } catch (err) {
    console.error(`Failed to fetch products for category ${selectedCategory.value}`, err);
  }
}
</script>

<style scoped>
.home-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.home-toolbar-fixed {
  position: fixed;
  top: 65.47px;
  width: 100%;
  z-index: 9;
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.home-toolbar-wrapper {
  background-color: #0077CA;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbar-spacer {
  height: 62.97px;
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

.category-dropdown select {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  background-color: white;
  color: #0077CA;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.category-dropdown select:hover {
  background-color: #f0f0f0;
}

.category-dropdown option {
  color: black;
}
</style>