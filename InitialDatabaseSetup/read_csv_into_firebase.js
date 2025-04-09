import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const firebaseConfig = {
		apiKey: "AIzaSyBT65k2G4Pep51ddupkx5EXwvyn1klVZSg",
		authDomain: "capjas-webstore.firebaseapp.com",
		projectId: "capjas-webstore",
		storageBucket: "capjas-webstore.firebasestorage.app",
		messagingSenderId: "62865436457",
		appId: "1:62865436457:web:4ff125b60885aab9d4d138",
		measurementId: "G-WG05TNFW6W"
	};

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);




// conversion from csv to json
// import convertCsvToJson from 'convert-csv-to-json';

import { parse } from 'csv-parse/sync';


// node's file system
import fs from 'fs';
import { json } from 'd3';



const fileInputName = 'initialDatabaseSetup/electronics_product.csv';
const fileOutputName = 'initialDatabaseSetup/electronics_product.json';


async function pushToFirebase(jsonData) {
	for(let entry in jsonData) {
		if(jsonData[entry] === undefined) {continue;} // don't push that one case

		let i = jsonData[entry];

		try {
			const docRef = await addDoc(collection(db, "products"), {
				name: i['name'],
				main_category: i['main_category'],
				sub_category: i['sub_category'],
				image: i['image'],
				link: i['link'],
				ratings: i['ratings'],
				no_of_ratings: i['no_of_ratings'],
				discount_price: i['discount_price'],
				actual_price: i['actual_price']
		});
			console.log("Document written with ID: ", docRef.id);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	console.log("finished adding all documents");
}

function newGenerateJson() {
	//function inspired by: https://csv.js.org/parse/api/sync/

	const csvData = fs.readFileSync(fileInputName, 'utf8');

	const records = parse(csvData, {
		columns: true,
		skip_empty_lines: true,
		trim: true
	});
	return records;
}


function cleanJsonData(jsonData) {
	for(let i in jsonData) {
		//convert indian rupee to cad
		console.log(jsonData[i].discount_price)
		jsonData[i].discount_price = parseFloat(jsonData[i].discount_price.replace('₹', '').replace(',', '')) * 0.016;
		jsonData[i].actual_price = parseFloat(jsonData[i].actual_price.replace('₹', '').replace(',', '')) * 0.016;
	}
	return jsonData;
}

async function main() {
	// let jsonData = generateJson();
	let jsonData = newGenerateJson()
	jsonData = cleanJsonData(jsonData);

	pushToFirebase(jsonData);
	console.log(jsonData);


	return;
}


main();

