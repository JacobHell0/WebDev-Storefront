<script setup>
import CartItem from '@/components/CartItem.vue'
import CartSummary from '@/components/CartSummary.vue';
import { ref, onMounted, onUnmounted } from 'vue'

const cartItems = ref([
    {
        "id": 5928101,
        "img": "🛒",
        "model": "GeForce 4070",
        "cost": 385,
        "sale": 0.15,
        "num": 5
    },
    {
        "id": 4582797,
        "img": "🛒",
        "model": "GeForce 4090",
        "cost": 450,
        "sale": 0.12,
        "num": 3
    },
    {
        "id": 8419988,
        "img": "🛒",
        "model": "GeForce 5090",
        "cost": 750,
        "sale": 0.0,
        "num": 1
    },
    {
        "id": 5928101,
        "img": "🛒",
        "model": "GeForce 5070ti",
        "cost": 625,
        "sale": 0.1,
        "num": 2
    },
    {
        "id": 4582797,
        "img": "🛒",
        "model": "GeForce 5080",
        "cost": 650,
        "sale": 0.05,
        "num": 2
    }
]);

// onMounted(() => {
//     console.log("--- cart mounted ---");

//     // API call here
//     CardServices.getGraphicCards()
//     // Callback when promise is resolved
//     .then((response) => {
//         cartItems.value = response.data
//     })
//     // Callback when promise is rejected
//     .catch((error) => {
//         console.log('== FAILED == \n', error)
//     });
// });

// onUnmounted(() => {
//     console.log('--- cart unmounted ---');
// });

function thisWorks() {
    console.log("you clicked checkout")
}
</script>

<template>
    <div class=flex id="page">
        <div id="items">
            <h2>Cart</h2>
            <CartItem v-for="item in cartItems" :key="item.id" :itemProp="item" />
        </div>
        <div id="summary">
            <CartSummary :cartProp="cartItems"></CartSummary>
            <button id="checkout" @click="thisWorks()">Proceed To Checkout</button>
        </div>
    </div>
</template>

<style scoped>
#page {
    display: grid;
    grid-template-columns: 60% 40%;
}

#items {
    margin-left: 2%;
}

#summary {
    margin-left: 20%;
    padding: 20px;
}

h1 {
    margin-top: 15%;
}

h2 {
    margin-bottom: 2%;
}

#checkout {
    background-color: white;
    border: 1px solid black;
    border-radius: 3px;
}

button {
    cursor: pointer;
    margin-top: 5%;
    margin-left: 25%;
    /* font-size: large; */
    width: 50%;
    font-size: medium;
    padding: 10px;
}

#page {
    margin-top: 1%;
}
</style>