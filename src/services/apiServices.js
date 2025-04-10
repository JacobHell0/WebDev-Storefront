// HANDLES ALL SERVER CALLS FROM FRONT END

import axios from 'axios';

//Single axios setup
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
  headers:
  {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


export default //CURRENTLY ALL JUST DEBUG REQUESTS
{
    getHelloMessage()
    {
        return apiClient.get('/hello');
    },
    getGoodbyeMessage()
    {
        return apiClient.get('/goodbye')
    },
    getServerStatus()
    {
        return apiClient.get('/server-status')
    },
    getProduct(productId) {
        return apiClient.get(`/products/${productId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching product:', error);
                throw error;
            });
        },
    getSortedByRating() {
        return apiClient.get('sort/high_ratings')
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching products by rating:', error);
                throw error;
            });
    },
    getByCategory(cat) {
        return apiClient.get(`category/${cat}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching products by category:', error);
                throw error;
            });
    },
    putOrderHistory(jsonData, userid) {
        let properJsonData = {
            "jsonData": jsonData
        }

        // console.log(JSON.stringify(properJsonData));

        return apiClient.put(`/order/put/${userid}`, properJsonData)
            .then(response => response.data)
            .catch(error => {
                console.error('Error putting order in the database', error)
                throw error;
            });
    },
    getOrderHistory(userid) {
        return apiClient.get(`order/get/${userid}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error getting order history', error)
                throw error;
            });
    },
    getByQuery(query) {
        return apiClient.get(`/search/${query}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error getting query', error)
                throw error;
            });
    },
    getUniqueCategories() {
        return apiClient.get(`/get/main-categories`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Server's probably down, this get can't error out: `, error)
                throw error;
            });
    },
    postContact(userid, name, email, subject, message) {
        let jsonData = {
            userid: userid,
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        return apiClient.post('/post/contact', jsonData)
            .then(response => response.data)
            .catch(error => {
                console.error(`error sending email: ${error}`)
                throw error;
            });
    },
    putItemInCart(userid, jsonData) {

        let properJsonData = {
            "jsonData": jsonData
        }

        console.log(properJsonData);

        return apiClient.put(`/cart/put/${userid}/`, properJsonData)
            .then(response => response.data)
            .catch(error => {
                console.error(`Error updating cart: ${error}`);
                throw error;
            });
    },



};
