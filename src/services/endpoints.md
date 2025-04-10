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