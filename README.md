# 🛒 CAPJAS Webstore

A responsive e-commerence storefront built with Vue 3, served by a nodemon backend using Firebase. This webstore uses modern UI designs to bring a intuitive and easy user experience.


## 🔧 Features

- **Modern & Intuitive Storefront**

    A modern and responsive storefront UI with easy discovery and navigation in mind.

- **Detailed product page**
     
    Comprehensive information for each product listed in the wwebstore, including imamges, ratings, and discounted pricing.

- **Shopping Cart & Checkout**

    Allows users to add items to a cart as they browse the website. Once users are done shopping, they are able to view their shopping cart, adjust quanities and remove items from thier cart if desired. Once the user begins to checkout, their information will automatically be pulled from thier profile for a seamless checkout process.

- **Custom Brand Logo**

    A vistually distinct and responsive SVG logo
    
- **User Authentication**  

    Secure login and registration with Firebase Authentication.

- **Profile Management**

    Users can view and edit thier account information at anytime, including Name, contact details, address. Users can also add payment methods for an easy checkout process.

- **Order History**

    Displays users order history in a clean and organized format. Each order lists all products, price, and allows the user to view that product.

- **Payment Methods**

    Allows users to securely store credit card information for easy use within the site. Users are able to view the cards they have registered with the site.

- **Real-Time data syncing**

    Uses a Rest API server to access a Firebase Database to allow real-time changes.


## 💻 Technologies in project

- **Vue 3** (Composition and Options API)
- **Firebase** (Authenication and Firestore)
- **Axios** (API Inegration)
- **Node.js, using the Nodemon Library** (Rest API Server)


## 🧰 Project Setup

0. **Requirements: npm and git installed and working**

1. **Clone the Repository**

    ```
    git clone https://github.com/JacobHell0/WebDev-Storefront.git
    ```

2. **Install the dependencies**

    ```
    npm install
    ```

3. **Setup the server**

    ```
    nodemon server.js
    ```

4. **Access the site at**

    [Local Host](http://localhost:3000/)


5. **Group Members and Contributions**

    1. Aaron James

         Login Component and authentication functionality (using firebase), Profile View including Account details, Order history and Payment methods

    2. Caleb Radbourne

        Most if not all code found in DisplayProductRow.vue, HomeView.vue, ProductListView.vue, App.vue. Routes involving the previously mentioned files in routs/index.js.

    3. Ayaan Mustafa

        Cart Page

    4. Jacob Rempel

        Everything found in server.js, as well as all the axios endpoints in apiServices.js, and minor frontend contributions like making the contact us form post to the backend. Aaron and I also setup and managed the firebase firestore for database management. I also made read_csv_into_firebase.js which reads the amazon dataset into firebase.

    5. Suhrab Roeen

        All functionality found within Products page (views/ProductView.vue)

    6. Patric Baguisa

         SVG Logo, About Page, Contact Page

