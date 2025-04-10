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

///////////////////////////// Unique Categories  /////////////////////////////
const UNIQUE_CATEGORIES = [
    'appliances',
    'tv, audio & cameras',
    'sports & fitness',
    'grocery & gourmet foods',
    'home & kitchen',
    'pet supplies',
    'stores',
    'appliances',
    'toys & baby products',
    "kids' fashion",
    'bags & luggage',
    'sports & fitness',
    'beauty & health',
    'tv, audio & cameras',
    'tv, audio & cameras',
    'car & motorbike',
    'car & motorbike',
    'car & motorbike',
    'car & motorbike',
    'sports & fitness',
    "men's shoes",
    'grocery & gourmet foods',
    'toys & baby products',
    'beauty & health',
    'pet supplies',
    "women's clothing",
    'stores',
    "women's shoes",
    'sports & fitness',
    'accessories',
    'tv, audio & cameras',
    'beauty & health',
    'appliances',
    'home & kitchen',
    'tv, audio & cameras',
    'home & kitchen',
    'home & kitchen',
    'beauty & health',
    'home & kitchen',
    'industrial supplies',
    "men's clothing",
    "kids' fashion",
    "kids' fashion",
    "kids' fashion",
    'home & kitchen',
    'appliances',
    'home & kitchen',
    'industrial supplies',
    "women's clothing",
    'beauty & health',
    'beauty & health',
    'stores',
    'appliances',
    'home, kitchen, pets',
    'bags & luggage',
    'sports & fitness',
    'tv, audio & cameras',
    "men's clothing",
    "women's shoes",
    'grocery & gourmet foods',
    'tv, audio & cameras',
    "men's shoes",
    'stores',
    'sports & fitness',
    'toys & baby products',
    'bags & luggage',
    'accessories',
    "men's clothing",
    'industrial supplies',
    'toys & baby products',
    'toys & baby products',
    'bags & luggage',
    'beauty & health',
    'appliances',
    "women's clothing",
    'sports & fitness'
];


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

    const doc = await getProductById(product_id);
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
    console.log(`getting order for user: ${userid}`)

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

app.get('/api/search/:query', async (req, res) => {
    const { query } = req.params;
    console.log(`querying: ${query}`)

    try {
        const firebaseQuery = await
        db.collection("products")      //\uf8ff is a very high unicode character so
            .orderBy("lowercase_name") //if query was lap, the special character would
            .startAt(`${query}`)       //essentially look like this: lap******* meaning
            .endAt(`${query}\uf8ff`)   //the query would return anything starting with lap
            .get()                     //like laptop, laptops, etc.
                                       //unfortunately this is the best option because
                                       //firebase doesn't support searching without
                                       //paying for the blaze tier.

        const results = firebaseQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(`returning ${results.length} results`);
        return res.status(200).json(results);

    } catch (error) {
        console.error(`Error fetching query: ${query}, error: ${error}`);
        return res.status(500).json({message: 'Internal server error'});
    }

});


app.get('/api/get/main-categories', async (req, res) => {
    // this endpoint will return the UNIQUE_CATEGORIES list
    console.log("returning unique categories");
    return res.send(UNIQUE_CATEGORIES);
});

app.post('/api/post/contact', async (req, res) => {
    const { userid, name, email, subject, message } = req.body;
    console.log("sending email");

    if (!userid || !name || !email || !subject || !message) {
        return res.status(400).json({error: 'All fields are required'});
    }

    try {
        const userRef = db.collection('users').doc(userid);
        const messageRef = userRef.collection('contact-message');

        // Create a document to store the info
        const newMessage = {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message
        };

        const messageDocRef = await messageRef.add(newMessage);

    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    return res.status(200).json({message: 'Successfully processed form, email sent to: ', email});
});


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

