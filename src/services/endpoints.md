# Endpoints

## Quick Notes
The endpoints are also available via browser, so you can use `fetch` or visit the url
for example: http://localhost:3000/api/products/4V5WWqlflRrTHLdVF4oi

The recommended way is via axios, with something like this in your vue component:
```js
apiServices.getProduct('4V5WWqlflRrTHLdVF4oi').then(response => {
    console.log(response);
});
```
The axios components throw errors, so you can use a .catch() block like this as well.
```js
apiServices.getProduct('4V5WWqlflRrTHLdVF4oi')
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error('Error fetching product:', error);
  });
```

## Secrets
Place the secrets file: `capjas-webstore-firebase-adminsdk.json` into `secrets/capjas-webstore-firebase-adminsdk.json`

## Format
Template for endpoints:

### `endpoint/name/url`
Example request through axios
```js
apiServices.getSomething().then(...)
```

Example Output (json)
```json
{
    "something": "is returned",
    "...": "..."
}
```

## Fetch Data From The Database



### `/api/products/your_product_ID_here`

Example request through axios
```js
apiServices.getProduct('4V5WWqlflRrTHLdVF4oi').then(response => {
    console.log(response);
});
```
Expected output (json data)
```json
{
  "name": "Sugar Free Green Natural Stevia Jar(200 g)",
  "main_category": "grocery & gourmet foods",
  "sub_category": "All Grocery & Gourmet Foods",
  "image": "https://m.media-amazon.com/images/I/61rBhkTJ6EL._AC_UL320_.jpg",
  "link": "https://www.amazon.in/Sugarfree-Green-100-Natural-Stevia/dp/B082TC6KL9/ref=sr_1_699?qid=1679216185&s=grocery&sr=1-699",
  "ratings": 4.3,
  "no_of_ratings": 1,
  "discount_price": 2.592,
  "actual_price": 2.72
}
```

### `http://localhost:3000/api/sort/high_ratings`

Example request through axios
```js
apiServices.getSortedByRating().then(response => {
    console.log(response);
});
```

Expected output (list of json data)
```json
[
  {
    "id": "q4WgYZuGuQZ7hTkBSRII",
    "name": "OnePlus Nord CE 2 Lite 5G (Blue Tide, 6GB RAM, 128GB Storage)",
    "main_category": "tv, audio & cameras",
    "sub_category": "All Electronics",
    "image": "https://m.media-amazon.com/images/I/71AvQd3VzqL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/OnePlus-Nord-Lite-128GB-Storage/dp/B09WQYFLRX/ref=sr_1_5?qid=1679133649&s=electronics&sr=1-5",
    "ratings": 4.3,
    "no_of_ratings": 113,
    "discount_price": 303.984,
    "actual_price": 319.984
  },
  {
    "id": "pXOW9RXH1TK9u2MtlLjU",
    "name": "ShineXPro Microfiber Car Cleaning Cloth - OG Soft 500 GSM Extra Large (35x75 CM) Microfiber Cloth for Car and Bike - Suede...",
    "main_category": "car & motorbike",
    "sub_category": "All Car & Motorbike Products",
    "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81hauo1yiwL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/ShineXPro-Microfiber-Car-Cleaning-Cloth/dp/B09RWTYMCF/ref=sr_1_3?qid=1679222595&s=automotive&sr=1-3",
    "ratings": 4.3,
    "no_of_ratings": 5,
    "discount_price": 7.984,
    "actual_price": 8.784
  }
]
```

### `http://localhost:3000/api/category/your_category_here`
The will return all the products with the category you enter

Example request through axios
```js
apiServices.getByCategory().then(response => {
    console.log(response);
});
```

Expected Response
```js
[
  {
    "id": "0tkG5F1OrCSIG9zi8AjH",
    "name": "Cadbury Bournvita 5 Star Magic Health Drink, 750g Pouch",
    "main_category": "grocery & gourmet foods",
    "sub_category": "All Grocery & Gourmet Foods",
    "image": "https://m.media-amazon.com/images/I/614FIW5c6HL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/Bournvita-Magic-Chocolate-Health-Refill/dp/B07BFQHW2Z/ref=sr_1_698?qid=1679216185&s=grocery&sr=1-698",
    "ratings": 4.3,
    "no_of_ratings": 8,
    "discount_price": null,
    "actual_price": 5.648
  },
  {
    "id": "4V5WWqlflRrTHLdVF4oi",
    "name": "Sugar Free Green Natural Stevia Jar(200 g)",
    "main_category": "grocery & gourmet foods",
    "sub_category": "All Grocery & Gourmet Foods",
    "image": "https://m.media-amazon.com/images/I/61rBhkTJ6EL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/Sugarfree-Green-100-Natural-Stevia/dp/B082TC6KL9/ref=sr_1_699?qid=1679216185&s=grocery&sr=1-699",
    "ratings": 4.3,
    "no_of_ratings": 1,
    "discount_price": 2.592,
    "actual_price": 2.72
  },
  {
    "id": "Jicr6FEDLqSSMFs4eX6p",
    "name": "Nutraj 100% Natural Dried Premium California Walnut Kernels, 500g (2 X 250g) | Pure Without Shell Walnut Kernels | Akhrot ...",
    "main_category": "grocery & gourmet foods",
    "sub_category": "All Grocery & Gourmet Foods",
    "image": "https://m.media-amazon.com/images/I/71f5UPOWDqL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/Nutraj-California-Walnut-Kernels-500g/dp/B07P56M78L/ref=sr_1_697?qid=1679216185&s=grocery&sr=1-697",
    "ratings": 3.9,
    "no_of_ratings": 6,
    "discount_price": 10.976,
    "actual_price": 15.968
  }
]
```

### `http://localhost:3000/api/order/put/firebase_user_id_goes_here`
This endpoint will accept a list of json objects, it then stores it in the database.
The endpoint returns data in this format, just in case you need it:
```js
return res.status(201).json({
    message: 'Order added to user history',
    orderId: orderDocRef.id, //reference to firebase doc
    data: newOrder //data you pushed into the data base, newORder is a list of product ids
});
```

Example request through axios (I wrapped it with getByCategory to have some test data)
As long as the jsonData is in the format `[{jsondata},{jsondata},{jsondata}]` it will work.
```js
apiServices.getByCategory("grocery & gourmet foods").then(response => {
    let jsonData = response;

    apiServices.putOrderHistory(jsonData, "5XKz7uJJioNpCgGHqdQ3w164JyN2 ").then(response => {
        console.log(response);
    });
});
```

Expected Response (I just took the console.log(response))
```js
Object { message: "Order added to user history", orderId: "MwZctNhNt1jr5CxWpiie", data: {…} }
data: Object { productIds: (3) […] }
message: "Order added to user history"
orderId: "MwZctNhNt1jr5CxWpiie"
```

### `http://localhost:3000/api/order/get/firebase_user_id_goes_here`
This endpoint will accept a user id and return that user's orders as json data.

Example request through axios
```js
apiServices.getOrderHistory("5XKz7uJJioNpCgGHqdQ3w164JyN2").then(response => {
    console.log(response);
});
```

Expected Response, also here's the format `[[json data], [json data]]`.
```js
[
  [
    {
      "name": "Sugar Free Green Natural Stevia Jar(200 g)",
      "main_category": "grocery & gourmet foods",
      "sub_category": "All Grocery & Gourmet Foods",
      "image": "https://m.media-amazon.com/images/I/61rBhkTJ6EL._AC_UL320_.jpg",
      "link": "https://www.amazon.in/Sugarfree-Green-100-Natural-Stevia/dp/B082TC6KL9/ref=sr_1_699?qid=1679216185&s=grocery&sr=1-699",
      "ratings": 4.3,
      "no_of_ratings": 1,
      "discount_price": 2.592,
      "actual_price": 2.72,
      "id": "4V5WWqlflRrTHLdVF4oi"
    },
    {
      "name": "Nutraj 100% Natural Dried Premium California Walnut Kernels, 500g (2 X 250g) | Pure Without Shell Walnut Kernels | Akhrot ...",
      "main_category": "grocery & gourmet foods",
      "sub_category": "All Grocery & Gourmet Foods",
      "image": "https://m.media-amazon.com/images/I/71f5UPOWDqL._AC_UL320_.jpg",
      "link": "https://www.amazon.in/Nutraj-California-Walnut-Kernels-500g/dp/B07P56M78L/ref=sr_1_697?qid=1679216185&s=grocery&sr=1-697",
      "ratings": 3.9,
      "no_of_ratings": 6,
      "discount_price": 10.976,
      "actual_price": 15.968,
      "id": "Jicr6FEDLqSSMFs4eX6p"
    }
  ],
  [
    {
      "name": "Cadbury Bournvita 5 Star Magic Health Drink, 750g Pouch",
      "main_category": "grocery & gourmet foods",
      "sub_category": "All Grocery & Gourmet Foods",
      "image": "https://m.media-amazon.com/images/I/614FIW5c6HL._AC_UL320_.jpg",
      "link": "https://www.amazon.in/Bournvita-Magic-Chocolate-Health-Refill/dp/B07BFQHW2Z/ref=sr_1_698?qid=1679216185&s=grocery&sr=1-698",
      "ratings": 4.3,
      "no_of_ratings": 8,
      "discount_price": null,
      "actual_price": 5.648,
      "id": "0tkG5F1OrCSIG9zi8AjH"
    },
    {
      "name": "Sugar Free Green Natural Stevia Jar(200 g)",
      "main_category": "grocery & gourmet foods",
      "sub_category": "All Grocery & Gourmet Foods",
      "image": "https://m.media-amazon.com/images/I/61rBhkTJ6EL._AC_UL320_.jpg",
      "link": "https://www.amazon.in/Sugarfree-Green-100-Natural-Stevia/dp/B082TC6KL9/ref=sr_1_699?qid=1679216185&s=grocery&sr=1-699",
      "ratings": 4.3,
      "no_of_ratings": 1,
      "discount_price": 2.592,
      "actual_price": 2.72,
      "id": "4V5WWqlflRrTHLdVF4oi"
    },
  ],
]
```


### `/api/search/your_query_goes_here`
Example request through axios
```js
apiServices.getByQuery("lloyd").then(response => {
    console.log(response);
});
```

Example Output (list of json) [`{json}`, `{json}`]

```json
[
  {
    "id": "5YWpHg1NIzQYdZ5KlKwT",
    "name": "Lloyd 1.5 Ton 3 Star Inverter Split Ac (5 In 1 Convertible, Copper, Anti-Viral + Pm 2.5 Filter, 2023 Model, White, Gls18I3...",
    "lowercase_name": "lloyd 1.5 ton 3 star inverter split ac (5 in 1 convertible, copper, anti-viral + pm 2.5 filter, 2023 model, white, gls18i3...",
    "main_category": "appliances",
    "sub_category": "Air Conditioners",
    "image": "https://m.media-amazon.com/images/I/31UISB90sYL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/Lloyd-Inverter-Convertible-Anti-Viral-GLS18I3FWAMC/dp/B0BRKXTSBT/ref=sr_1_4?qid=1679134237&s=kitchen&sr=1-4",
    "ratings": 4.2,
    "no_of_ratings": 2,
    "discount_price": 527.984,
    "actual_price": 943.84
  },
  {
    "id": "CHsmy7vKFO9Ec9qyu8BF",
    "name": "lloyd SOFTSPUN Microfiber Cloth - 4 pcs - 40x40 cms - 340 GSM Grey- Thick Lint & Streak-Free Multipurpose Cloths - Automotive Mi...",
    "main_category": "car & motorbike",
    "sub_category": "All Car & Motorbike Products",
    "image": "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/91C6slV1XGL._AC_UL320_.jpg",
    "link": "https://www.amazon.in/SOFTSPUN-Microfiber-Cleaning-Detailing-Polishing/dp/B077BFH786/ref=sr_1_1?qid=1679222595&s=automotive&sr=1-1",
    "ratings": 4.3,
    "no_of_ratings": 78,
    "discount_price": 4.304,
    "actual_price": 9.664,
    "lowercase_name": "lloyd softspun microfiber cloth - 4 pcs - 40x40 cms - 340 gsm grey- thick lint & streak-free multipurpose cloths - automotive mi..."
  }
]
```


