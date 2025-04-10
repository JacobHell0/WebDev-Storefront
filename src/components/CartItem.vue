<script setup>
defineProps({
  itemProp: {
    type: Object,
    required: true,
  },
})

/**
 * 
 */
function remove_item() {
  document.getElementById("cartItem").remove()
}
</script>

<template>
  <table id="cartItem" class="item">
    <tr>
      <td>{{ itemProp.img }}</td>
      <td>{{ itemProp.model }}</td>
      <div v-if="itemProp.sale === 0.0">
        <td>${{ itemProp.cost }}</td>
      </div>
      <div v-else>
        <td style="text-decoration: line-through;">${{ itemProp.cost }}</td>
        <td style="color: red; font-weight: bold;">${{ itemProp.cost * (1 - itemProp.sale) }}</td>
      </div>
      <td style="text-align: center;">{{ itemProp.num }}</td>
      <td @click="remove_item()" class="remove" style="text-align: right;"><button>{{ "❌" }}</button></td>
    </tr>
    <tr>
      <p>some info goes here</p>
    </tr>
  </table>
</template>

<style scoped>
table {
  border-radius: 5px;
  margin-bottom: 3%;
  width: 100%;
  padding: 10px;
  box-shadow: 0px 0px 5px gray;
}

td {
  padding: 10px;
}

button {
  background-color: white;
  border: none;
  text-align: right;
}

tr {
  display:  grid;
  grid-template-columns: 20% 30% 25% 15% 10%;
  grid-template-rows: auto;
}
</style>