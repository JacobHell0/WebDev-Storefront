<script setup>
</script>

<template>
  <main class="home-page">
    <!-- Toolbar under header -->
   <div class="home-toolbar-fixed">   
    <div class="home-toolbar-wrapper">
    <div class="home-toolbar">
      <button @click="loadOrderHistory">Buy Again</button>

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

    <DisplayProductRow
      source = "rating"
      title = "Top Rated Picks:"
    />

    <DisplayProductRow
      source = "appliances"
      title = "Appliances:"
    />

    <DisplayProductRow
      source = "grocery & gourmet foods"
      title = "Grocery & Gourmet Foods:"
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

onMounted(async () => {
  try {
    const response = await apiServices.getUniqueCategories();
    mainCategories.value = response;

  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});


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

.filter-group select {
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  color: #0077CA;
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