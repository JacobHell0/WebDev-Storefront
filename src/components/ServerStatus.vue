<!-- This file is to simply display a response from the server to check if its able to connect -->

<template>
    <div>
        <p class="message-style">{{ message }}</p>
    </div>
  </template>

  <script>
  import apiServices from '@/services/apiServices';

  export default
   {
    data()
    {
      return {
        message: 'Something went wrong (Server likely offline) :(', //Default message
      };
    },
    mounted()
    {
      this.fetchServerStatus();
    },
    methods: {
      async fetchServerStatus()
      {
        apiServices.getServerStatus()
          .then(response => {
            this.message = response.data; //Display message from server
          })
          .catch(error => {
            console.error('There was an error fetching the server status:', error); //Error
          });

          // apiServices.getProduct('4V5WWqlflRrTHLdVF4oi').then(response => {
          //   console.log(response);
          // });
          // apiServices.getSortedByRating().then(response => {
          //   console.log(response);
          // });

          // apiServices.getByCategory("grocery & gourmet foods").then(response => {
          //   let jsonData = response;
          //   // console.log("calling backend with:");
          //   // console.log(jsonData);
          //   apiServices.putOrderHistory(jsonData, "5XKz7uJJioNpCgGHqdQ3w164JyN2 ").then(response => {
          //     console.log(response);
          //   });
          // });

        //   apiServices.getOrderHistory("5XKz7uJJioNpCgGHqdQ3w164JyN2").then(response => {
        //     console.log(response);
        //   });

        // apiServices.getByQuery("lloyd").then(response => {
        //     console.log(response);
        // });

        // apiServices.getUniqueCategories().then(response => {
        //     console.log(response);
        // });

        // apiServices.postContact("5XKz7uJJioNpCgGHqdQ3w164JyN2", "Jacob",
        //                         "jacob.h3ll0@gmail.com", "Subject!", "MY MESSAGE").then(response => {
        //     console.log(response);
        // });
        // let jsonData = await apiServices.getByQuery("lloyd");
        // jsonData[0].count = 2;
        // apiServices.putItemInCart("5XKz7uJJioNpCgGHqdQ3w164JyN2", jsonData);
        // apiServices.getCartItems("5XKz7uJJioNpCgGHqdQ3w164JyN2").then(response => {
        //     console.log(response);
        // });

        // apiServices.deleteCart("5XKz7uJJioNpCgGHqdQ3w164JyN2").then(response => {
        //     console.log(response);
        // });
        // apiServices.deleteItemInCart("5XKz7uJJioNpCgGHqdQ3w164JyN2", "8iCL4tIC8nPgaH7gSgRe").then(response => {
        //     console.log(response);
        // });
      }
    }
  };
  </script>

  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 60px;
  }

  .message-style {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    padding: 10px;
  }
  </style>
