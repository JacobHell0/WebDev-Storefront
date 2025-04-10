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
      <div class="cost" v-if="itemProp.sale === 0.0">
        <td class="noSale">${{ itemProp.cost }}</td>
      </div>
      <div class="cost" v-else>
        <td class="normalCost" style="text-decoration: line-through;">${{ itemProp.cost }}</td>
        <td class="saleCost" style="color: red; font-weight: bold;">${{ itemProp.cost * (1 - itemProp.sale) }}</td>
      </div>
      <td>
        <div id="num">
          <button class="inc">/\</button>
          <input :value="itemProp.num" readonly />
          <button class="dec arrow down">\/</button>
        </div>
      </td>
      <td @click="remove_item()" class="remove" style="text-align: right;"><button>{{ "❌" }}</button></td>
    </tr>
    <tr class="info">
      <p>some info goes here</p>
    </tr>
  </table>
</template>

<style scoped>
tr {
  display: grid;
  grid-template-columns: 20% 30% 25% 15% 10%;
  grid-template-rows: auto;
}

table {
  border-radius: 5px;
  margin-bottom: 3%;
  width: 90%;
  margin-left: 5%;
  padding: 10px;
  box-shadow: 0px 0px 5px gray;
}

.info {
  display: none;
}

.cost {
  margin-left: 25%;
}

.noSale {
  padding-left: 0px;
}

.normalCost {
  display: none;
  padding-left: 0px;
}

.saleCost {
  padding-left: 0px;
}

button {
  background-color: white;
  border: none;
  text-align: right;
  cursor: pointer;
}

button:hover {
  box-shadow: 0px 0px 1px;
}

#num {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  text-align: center;
}

input {
  text-align: center;
  width: 60%;
}

.inc, .dec {
  text-align: center;
  width: 60%;
}

.inc {
  margin-bottom: 4px;
}

.dec {
  margin-top: 4px;
}

@media (min-width: 1024px) {
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

  .info {
    display: inline;
  }

  .normalCost {
    display: inline;
  }
}
</style>