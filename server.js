//SERVER FOR VUE FRONT END - CURRENTLY VERY BASIC TXT RETURNS

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

//API Endpoint
app.get('/api/hello', (req, res) => {
    console.log("Accessing /api/hello");
    res.send('Hello from the server!!');
});

app.get('/api/status', (req, res) => {
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

/////////////////////////////   Error Handling    /////////////////////////////


///////////////////////////// Firebase Endpoints /////////////////////////////

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
        return res.status(200).json(doc.data())
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


//////////////////////////////////////////////////////////////////////////////

//Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

//catch all other and return index.html
app.get(/.*/, (req, res) =>
{
    console.log("Requested URL:", req.originalUrl);
    console.log("Request not caught ... giving the index.html")
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const port = 3000; //Launch server on port 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

