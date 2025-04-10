<script>
import CartItem from '@/components/CartItem.vue'
import CartSummary from '@/components/CartSummary.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '@/firebase';
import apiServices from '@/services/apiServices';
import router from '@/router';

export default 
{
    data() 
    {
        return {
            userDetails: {},
        };
    },
    created() 
    {
        const auth = getAuth(app); //Get user auth
        onAuthStateChanged(auth, async (user) => {
            if (user) //Make sure they are authed
            {
                this.user = user;
                await this.fetchUserDetails(user.uid);
                await this.fetchCards();
                await this.loadOrderHistory();
            } 
            else //Otherwise return them to the login page
            {
                router.push('/login');
            }
        });
    },
    methods: 
    {
        async loadOrderHistory() //Load the users order history using API
        {
            this.loadingOrders = true;
            try 
            {
                const response = await apiServices.getCartItems(this.user.uid);
                this.orderHistory = Array.isArray(response) ? response : []; //If the response is not incorrect form, it will just make it empty to avoid runtime errs
                console.log('Loaded order history:', this.orderHistory);
            } 
            catch (error)
            {
                console.error("Failed to load order history:", error);
                this.orderHistory = [];
            } 
            finally 
            {
                this.loadingOrders = false;
            }
        },
    },
};

// const cartItems = ref([
//     {
//         "id": 5928101,
//         "img": "🛒",
//         "model": "GeForce 4070",
//         "cost": 385,
//         "sale": 0.15,
//         "num": 5
//     },
//     {
//         "id": 4582797,
//         "img": "🛒",
//         "model": "GeForce 4090",
//         "cost": 450,
//         "sale": 0.12,
//         "num": 3
//     },
//     {
//         "id": 8419988,
//         "img": "🛒",
//         "model": "GeForce 5090",
//         "cost": 750,
//         "sale": 0.0,
//         "num": 1
//     },
//     {
//         "id": 5928101,
//         "img": "🛒",
//         "model": "GeForce 5070ti",
//         "cost": 625,
//         "sale": 0.1,
//         "num": 2
//     },
//     {
//         "id": 4582797,
//         "img": "🛒",
//         "model": "GeForce 5080",
//         "cost": 650,
//         "sale": 0.05,
//         "num": 2
//     }
// ]);

// async onMounted(() => {
//     try 
//                 {
//                     const response = await apiServices.getOrderHistory(this.user.uid);
//                     this.orderHistory = Array.isArray(response) ? response : []; //If the response is not incorrect form, it will just make it empty to avoid runtime errs
//                     console.log('Loaded order history:', this.orderHistory);
//                 } 
//                 catch (error)
//                 {
//                     console.error("Failed to load order history:", error);
//                     this.orderHistory = [];
//                 } 
// });

// // onUnmounted(() => {
// //     console.log('--- cart unmounted ---');
// // });

// function thisWorks() {
//     console.log("you clicked checkout")
// }
// </script>

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
    margin-top: 35px;
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: auto;
}

h2 {
    margin-left: 5%;
    margin-bottom: 2%;
}

button {
    cursor: pointer;
    margin-top: 5%;
    margin-left: 30%;
    margin-bottom: 5%;
    width: 40%;
    font-size: medium;
    padding: 5px;
}

@media (min-width: 1024px) {
    #page {
        display: grid;
        grid-template-columns: 60% 40%;
        margin-top: 1%;
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
        width: 50%;
        font-size: medium;
        padding: 10px;
    }
}
</style>