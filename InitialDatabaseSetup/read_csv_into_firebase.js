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


// node's file system
import fs from 'fs';

// csv parsing
import { parse } from 'csv-parse/sync';

const dirName = 'initialDatabaseSetup'



async function pushToFirebase(jsonData) {
	for(let entry = 0; entry < jsonData.length; entry++) {
		if(jsonData[entry] === undefined) {continue;} // don't push that one case

		let i = jsonData[entry];

		try {
			const docRef = await addDoc(collection(db, "products"), {
				name: i['name'],
				lowercase_name: i['lowercase_name'],
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

function generateJson(fileInputName) {
	//function inspired by: https://csv.js.org/parse/api/sync/

	const csvData = fs.readFileSync(fileInputName, 'utf8');

	const records = parse(csvData, {
		columns: true,
		skip_empty_lines: true,
		trim: true
	});
	return records;
}

async function isImageLinkValid(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok && res.headers.get('content-type')?.startsWith('image/');
    } catch (error) {
        return false;
    }
}

async function cleanJsonData(jsonData) {

    let newJsonData = [];

    for(let i = 0; i < jsonData.length; i++) {
        if (await isImageLinkValid(jsonData[i].image)) {
            newJsonData.push(jsonData[i]);
        }
    }

    for(let i = 0; i < newJsonData.length; i++) {
		//convert indian rupee to cad
		newJsonData[i].discount_price = parseFloat(newJsonData[i].discount_price.replace('₹', '').replace(',', '')) * 0.016;
		newJsonData[i].actual_price = parseFloat(newJsonData[i].actual_price.replace('₹', '').replace(',', '')) * 0.016;
		newJsonData[i].no_of_ratings = parseFloat(newJsonData[i].no_of_ratings);
		newJsonData[i].ratings = parseFloat(newJsonData[i].ratings);
		newJsonData[i].lowercase_name = newJsonData[i].name.toLowerCase();
	}

    console.log(`Processed ${newJsonData.length} entries`);

	return newJsonData;
}

async function main() {

	// const HOW_MANY_FILES_TO_LOOK_AT = 2
	const ENTRIES_PER_FILE = 3

	// for each file
	let files = fs.readdirSync(`${dirName}/amazon/`);
	let c = 0;
    let empty = 0;
    let empty_names = [];

    let unique_categories = [];

	for(let file of files) {
		console.log(file);
		let jsonData = generateJson(`${dirName}/amazon/${file}`); // grab first 100 entries (1 entry to start with)
        let snippet = jsonData.slice(0, ENTRIES_PER_FILE);

        if (JSON.stringify(snippet) === '[]') {
            empty++;
            empty_names.push(file);
            continue;
        }

		let clean_snippet = await cleanJsonData(snippet); // clean json data
        if (JSON.stringify(clean_snippet) === '[]') {
            empty++;
            empty_names.push(file);
            continue;
        }

        // keep track of categories (only if the json data is not empty)
        unique_categories.push(snippet[0].main_category);

		console.log(`========================== pushing: ${file} ==========================`)
		await pushToFirebase(clean_snippet);
		console.log(`========================== finished ${file} ==========================\n\n`)

		// if (c === HOW_MANY_FILES_TO_LOOK_AT) break;
		// c++;
	}
    console.log("unique categories: ");
    console.log(unique_categories);
	console.log("Database initialized, empty files: ", empty, "\n");
	return;
}


await main();
// console.log(await isImageLinkValid("https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/91C6slV1XGL._AC_UL320_.jpg"), "should be: ", false);
// console.log(await isImageLinkValid("https://m.media-amazon.com/images/I/31UISB90sYL._AC_UL320_.jpg"), "should be: ", true);

process.exit()