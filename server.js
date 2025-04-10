//SERVER FOR VUE FRONT END - CURRENTLY VERY BASIC TXT RETURNS

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
// const algoliasearch = require('algoliasearch');
import { algoliasearch } from 'algoliasearch';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path: './secrets/.env'});

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
    'accessories',
    'appliances',
    'bags & luggage',
    'beauty & health',
    'car & motorbike',
    'grocery & gourmet foods',
    'home & kitchen',
    'home, kitchen, pets',
    'industrial supplies',
    "kids' fashion",
    "men's clothing",
    "men's shoes",
    'pet supplies',
    'sports & fitness',
    'stores',
    'toys & baby products',
    'tv, audio & cameras',
    "women's clothing",
    "women's shoes"
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
    console.log(`querying: ${query}`);

    const searchClient = algoliasearch('FQ67AYU0IJ', '896ab150949b98a3dcca2001629d2d48');

    // make search on products
    searchClient
        .search({
            requests: [
            {
                indexName: 'products',
                query: query,
            }],
        })
        .then(async ({ results }) => {

            let jsonData = [];
            for(let item of results[0].hits) {
                let path = item.path;
                path = path.replace("products/", "");
                let doc = await getProductById(path).then();
                let newJson = doc.data();
                newJson.id = path;
                jsonData.push(newJson);
            }

            // console.log(jsonData);
            console.log(`returning ${jsonData.length} results`);

            return res.status(200).json(jsonData);
        })
        .catch(err => {
            console.error(err);
        });

});


app.get('/api/get/main-categories', async (req, res) => {
    // this endpoint will return the UNIQUE_CATEGORIES list
    console.log("returning unique categories");
    // let uniq = [new Set(UNIQUE_CATEGORIES)];
    // uniq.sort();
    // let uniq = UNIQUE_CATEGORIES;
    // uniq.sort();
    // console.log(uniq);
    return res.send(UNIQUE_CATEGORIES);
});

async function sendEmail(name, address, subject, body) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: address,
        cc: process.env.WEBDEV_ADDRESS,
        subject: subject,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Mail Sent');
    } catch (error) {
        console.error('Error sending mail:', error);
    }

}

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
        let new_message = `Hello ${name}! This is a copy of the email sent to CapJas!\n\n` + message;
        await sendEmail(name, email, subject, new_message);

    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


    return res.status(200).json({message: 'Successfully processed form, email sent to: ', email});
});

app.put('/api/cart/put/:userid/', async (req, res) => {
    console.log("updating cart");
    const { userid } = req.params;
    const { jsonData } = req.body;

    console.log(jsonData);

    //puts a list of products id into the database
    try {
        const userRef = db.collection('users').doc(userid);
        const orderHistoryRef = userRef.collection('cart');

        let arr = []

        for(let entry of jsonData) {
            if (!("id" in entry)) {return res.status(400).json({ message: `Bad request, this json object: ${entry} does not contain the (Firebase) 'id' field.` });}

            if (entry.count === undefined) {
                entry.count = 1;
            }
            arr.push({ id: entry.id, count: entry.count });

        }
        // Create a new order document
        const newCart = {
            productIds: arr,
        };

        const orderDocRef = await orderHistoryRef.add(newCart);

        console.log("order added successfully");
        return res.status(201).json({
            message: 'Order added to user history',
            orderId: orderDocRef.id,
            data: orderDocRef
        });

    } catch (error) {
        console.error('Error adding order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }


});

app.get('/api/cart/get/:userid/', async (req, res) => {
    console.log("fetching cart items");

    const { userid } = req.params;

    try {
        const userRef = db.collection('users').doc(userid);
        const cartRef = userRef.collection('cart');

        // Fetch all cart items from the 'cart' collection
        const snapshot = await cartRef.get();

        if (snapshot.empty) {
            return res.status(404).json({
                message: `Cart for user ${userid} is empty or does not exist.`
            });
        }

        let returnData = [];

        // go throughg each item retrieved from firebase
        for (let doc of snapshot.docs) {

            const cartItem = doc.data();
            for (let {id: productId, count} of cartItem.productIds) { //net way of bundling items I found on stack overflow
                let productDoc = await getProductById(productId);
                let newJson = productDoc.data();
                newJson.id = productId;
                newJson.count = count;
                returnData.push(newJson);
            }
        }

        return res.status(200).json({
            message: 'Cart items fetched successfully.',
            cartItems: returnData
        });

    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/cart/delete/:userid/:productid', async (req, res) => {
    console.log("deleting by id");
    const { userid, productid } = req.params;

    const cartRef = db.collection('users').doc(userid).collection('cart');

    try {
        const querySnapshot = await cartRef.get();

        // Collect all product IDs
        const allProductIDs = querySnapshot.docs.map(snapshot => {
            const data = snapshot.data();
            console.log(data);
            for(let entry of data.productIds) {
                console.log("test: ", entry);
                if(entry.id === productid) {
                    // Update the document in Firestore
                    // Delete the product ID here
                    data.productIds.splice(data.productIds.indexOf(entry), 1); //remove product
                    snapshot.ref.update({ productIds: data.productIds });
                    break;
                }
            }
        });

        // Log or return the collected product IDs
        console.log("All product IDs:", allProductIDs);


        res.status(200).send('All carts deleted successfully');
    } catch (error) {
        console.error('Error deleting carts: ', error);
        res.status(500).send('Error deleting carts');
    }
});

app.delete('/api/cart/delete/all/:userid', async (req, res) => {
    const { userid } = req.params;

    const cartRef = db.collection('users').doc(userid).collection('cart');

    try {
        const querySnapshot = await cartRef.get();

        //delete all documents in cart
        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete()); //found from firebase docs
        await Promise.all(deletePromises);

        console.log('All carts deleted successfully');
        res.status(200).send('All carts deleted successfully');
    } catch (error) {
        console.error('Error deleting carts: ', error);
        res.status(500).send('Error deleting carts');
    }
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

