//SERVER FOR VUE FRONT END - CURRENTLY VERY BASIC TXT RETURNS

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use(express.json()); //middleware for json

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

async function getProductById(product_id) {
    const productRef = db.collection('products').doc(product_id);
    return await productRef.get();
}

app.get('/api/products/:product_id', async (req, res) => {
    const { product_id } = req.params;

    console.log("accessing firebase");

    const doc = getProductById(product_id);
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
    const { jsonData } = req.body;
    console.log(`updating ${userid}`)
    console.log(`raw json: ${jsonData}`);
    console.log(`json: ${JSON.stringify(jsonData)}`);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return res.status(400).json({ message: 'data must be a non-empty array of json data' });
    }

    try {
        const userRef = db.collection('users').doc(userid);
        const orderHistoryRef = userRef.collection('orderhistory');

        let arr = []
        for(let entry of jsonData) {
            if (!("id" in entry)) {return res.status(400).json({ message: `Bad request, this json object: ${entry} does not contain the (Firebase) 'id' field.` });}
            arr.push(entry.id);
        }
        // Create a new order document
        const newOrder = {
            productIds: arr,
        };

        const orderDocRef = await orderHistoryRef.add(newOrder);

        console.log("order added successfully");
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

app.get('/api/order/get/:userid', async (req, res) => {
    // this endpoint will accept a user id and return that users orders as json
    // data
    const { userid } = req.params;

    try {
        const userRef = db.collection('users').doc(userid);
        const orderHistoryRef = userRef.collection('orderhistory');

        const snapshot = await orderHistoryRef.get();

        if (snapshot.empty) {
            console.log(`Unable to fetch document for: ${userid}`);
            return res.status(404).json({message: `Unable to fetch document for: ${userid}`})
        } else {
            const orders = snapshot.docs.map(snapshot => {
                return {
                    id: snapshot.id,
                    ...snapshot.data()
                };
            });

            let return_data = [];

            console.log(orders);

            for(let entry of orders) {
                let json_data = [];
                for(let product_id of entry.productIds) {
                    // console.log("ids: ", product_id);
                    let doc = await getProductById(product_id);
                    let newJson = doc.data();
                    newJson.id = product_id;
                    json_data.push(newJson);
                    // console.log('pushing: ', newJson);
                }
                return_data.push(json_data);
            }

            // debug print
            // for (let entry of return_data) {
            //     for (let entry2 of entry) {
            //         console.log("---------------\n")
            //         console.log(entry2);
            //     }
            // }

            console.log(`returning order history for: ${userid}`);
            return res.status(200).json(return_data);
        }

    } catch (error) {
        console.error('Error fetching order: ', error);
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

