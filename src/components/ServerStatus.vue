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
      fetchServerStatus()
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
          // apiServices.getByCategory().then(response => {
          //   console.log(response);
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
