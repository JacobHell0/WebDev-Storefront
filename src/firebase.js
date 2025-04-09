//Firebase Configuration File

//Import fundamental firebase stuff
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBT65k2G4Pep51ddupkx5EXwvyn1klVZSg",
    authDomain: "capjas-webstore.firebaseapp.com",
    projectId: "capjas-webstore",
    storageBucket: "capjas-webstore.firebasestorage.app",
    messagingSenderId: "62865436457",
    appId: "1:62865436457:web:4ff125b60885aab9d4d138",
    measurementId: "G-WG05TNFW6W"
};

//Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

