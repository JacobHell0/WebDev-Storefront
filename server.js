//SERVER FOR VUE FRONT END - CURRENTLY VERY BASIC TXT RETURNS

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.get('/api/server-status', (req, res) => {
    console.log("Accessing /api/serverStatus");
    res.send("If you are seeing this, the server is working :)");
});


///////////////////////////// Firebase Setup /////////////////////////////

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

// read in firebase secret
import fs from 'fs';
let rawdata = fs.readFileSync('secrets/capjas-webstore-firebase-adminsdk.json');
let serviceAccount = JSON.parse(rawdata);


// init Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

/////////////////////////////   Error Handling    //////////////////////////////


////////////////////////////// Firebase Endpoints //////////////////////////////

app.get('/api/products/:product_id', async (req, res) => {
    const { product_id } = req.params;

    console.log("accessing firebase");

    const productRef = db.collection('products').doc(product_id);
    const doc = await productRef.get();
    if (!doc.exists) {
        console.log(`Unable to fetch document: ${product_id}`);
        return res.status(404).json({message: "error, document does not exist"})
    } else {
        console.log('Document fetched:', doc.data());

        let newJson = doc.data();
        newJson.id = product_id;
        return res.status(200).json(newJson);
    }
});

// app.get('api/category/:category', async (req, res) => {
//     const { category } = req.params;

// });

app.get('/api/sort/high_ratings', async (req, res) => {
    const productsRef = db.collection('products').orderBy('ratings', 'desc');
    const snapshot = await productsRef.get();

    // check for response
    if (snapshot.empty) {
        console.log('error, no documents found');
        return res.status(404).json({ message: 'error, no documents found' });
    }

    // Map the query snapshot to an array of document data
    const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return res.status(200).json(products);

});

app.get('/api/category/:category', async (req, res) => {
    const { category } = req.params;
    console.log(`querying: ${category}`)

    const productsRef = db.collection('products').where("main_category", "==", category);
    const snapshot = await productsRef.get();

    // check for response
    if (snapshot.empty) {
        console.log(`category search: error, no documents found for category: ${category}`);
        return res.status(404).json({ message: `error, no documents found for category: ${category}` });
    }

    // Map the query snapshot to an array of document data
    const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return res.status(200).json(products);

});

app.put('/api/order/put/:userid', async (req, res) => {
    // this endpoint will accept a list of json objects, it will only look at
    // their id to put them in the database
    const { userid } = req.params;
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: 'productIds must be a non-empty array of json data' });
    }

    try {
        const userRef = db.collection('users').doc(userid);
        const orderHistoryRef = userRef.collection('orderhistory');

        // Create a new order document
        const newOrder = {
            productIds,
        };

        const orderDocRef = await orderHistoryRef.add(newOrder);

        return res.status(201).json({
            message: 'Order added to user history',
            orderId: orderDocRef.id,
            data: newOrder
        });

    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// Algolia Search ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

//catch all other and return index.html
app.get(/.*/, (req, res) =>
{
    console.log("Requested URL:", req.originalUrl);
    console.log("Request not caught ... returning the index.html")
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const port = 3000; //Launch server on port 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

