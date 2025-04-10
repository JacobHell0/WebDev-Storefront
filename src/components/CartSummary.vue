<script setup>
let cart = defineProps({
  cartProp: {
    type: Object,
    required: true,
  },
})

cart = cart.cartProp

let subtotal = 0

for (let item of cart) {
  subtotal += item.cost * item.num
}

let discount = 0

for (let item of cart) {
  discount += item.cost - (item.cost * item.sale)

  console.log()
}

let isSale = true

if (discount === 0) {
  isSale = false
}

let ehf = Math.round((subtotal * 0.008) * 100) / 100
let shipping = 8.99 + Math.round((subtotal * 0.02) * 100) / 100
let hst = Math.round(((subtotal - discount + ehf) * 0.13) * 100) / 100

let total = Math.round(((subtotal - discount + ehf) * 1.13 + shipping) * 100) / 100
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>
          <h1 style="margin-left: 10px;">Summary</h1>
        </th>
        <th>
          <h1 style="margin-right: 10px;">‎</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Cart Item Subtotal:</td>
        <td>${{ subtotal }}</td>
      </tr>
      <tr v-if="isSale">
        <td>Total Discount:</td>
        <td>${{ discount }}</td>
      </tr>
      <tr>
        <td>Shipping Cost:</td>
        <td>${{ shipping }}</td>
      </tr>
      <tr>
        <td>Enviormental Handling Fees (EHF):</td>
        <td>${{ ehf }}</td>
      </tr>
      <tr>
        <td>Estimated HST:</td>
        <td>${{ hst }}</td>
      </tr>
    </tbody>
    <thead>
      <tr>
        <th>
          <h3 style="margin-left: 10px;">Total:</h3>
        </th>
        <th>
          <h3 style="margin-right: 10px;">${{ total }}</h3>
        </th>
      </tr>
    </thead>
  </table>
</template>

<style scoped>
td {
  padding: 10px;
}

h1 {
  border-bottom: 1px dashed black;
  text-align: left;
  padding: 10px;
  padding-left: 0px;
  margin-top: 0px;
}

h3 {
  border-top: 1px dashed black;
  text-align: left;
  padding: 10px;
}

table {
  background-color: aliceblue;
  margin-top: 20%;
  border-collapse: collapse;
}
</style>