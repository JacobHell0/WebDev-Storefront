<!-- This is a profile component to fetch the current users over all account information and settings -->

<template>
    <div class="profile-layout">
    <div class="sidebar">
        <ul>
            <li v-for="tab in tabs" :key="tab" @click="currentTab = tab" :class="{ active: currentTab === tab }">
            {{ tab }}
            </li>
        </ul>
    </div>
    <div class="content">
        <div v-if="currentTab === 'Account Overview' && user">
            <!-- Profile Details -->
            <div class="profile-container">
            <h1>Profile Details</h1>
            <div v-if="editMode">
                <p><strong>First Name:</strong> <input v-model="editableUserDetails.firstName" />
                <span class="error" v-if="errors.firstName">{{ errors.firstName }}</span></p>
                <p><strong>Last Name:</strong> <input v-model="editableUserDetails.lastName" />
                <span class="error" v-if="errors.lastName">{{ errors.lastName }}</span></p>
                <p><strong>Email:</strong> <input v-model="editableUserDetails.email" />
                <span class="error" v-if="errors.email">{{ errors.email }}</span></p>
                <p><strong>Address:</strong> <input v-model="editableUserDetails.address" />
                <span class="error" v-if="errors.address">{{ errors.address }}</span></p>
                <p><strong>Postal Code:</strong> <input v-model="editableUserDetails.postalcode" />
                <span class="error" v-if="errors.postalcode">{{ errors.postalcode }}</span></p>
                <p><strong>City:</strong> <input v-model="editableUserDetails.city" />
                <span class="error" v-if="errors.city">{{ errors.city }}</span></p>
                
                <div class="form-group">
                    <label for="province">Province/State: </label>
                    <select id="province" v-model="editableUserDetails.province" required>
                        <option value="">Select Province/State</option>
                        <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                    </select>
                    <span class="error" v-if="errors.province">{{ errors.province }}</span>
                </div>

                <!-- Dropdown for Country -->
                <div class="form-group">
                    <label for="country">Country: </label>
                    <select id="country" v-model="editableUserDetails.country" @change="updateProvinces" required>
                        <option value="">Select Country</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                    </select>
                    <span class="error" v-if="errors.country">{{ errors.country }}</span>
                </div>
                <p><strong>Telephone:</strong> <input v-model="editableUserDetails.telephone" />
                <span class="error" v-if="errors.telephone">{{ errors.telephone }}</span></p>
            </div>
            <div v-else>
                <p><strong>First Name:</strong> {{ userDetails.firstName }}</p>
                <p><strong>Last Name:</strong> {{ userDetails.lastName }}</p>
                <p><strong>Email:</strong> {{ userDetails.email }}</p>
                <p><strong>Address:</strong> {{ userDetails.address }}</p>
                <p><strong>Postal Code:</strong> {{ userDetails.postalcode }}</p>
                <p><strong>City:</strong> {{ userDetails.city }}</p>
                <p><strong>Province/State:</strong> {{ userDetails.province }}</p>
                <p><strong>Country:</strong> {{ userDetails.country }}</p>
                <p><strong>Telephone:</strong> {{ userDetails.telephone }}</p>
            </div>
            <div class="button-group">
                <button v-if="editMode" @click="saveProfile">Save</button>
                <button v-else @click="editProfile">Edit Profile</button>
                <button @click="editMode ? cancelEdit() : logout()">{{ editMode ? 'Cancel' : 'Logout' }}</button>
            </div>
            </div>
        </div>
        
            <!-- Order History -->
            <div v-if="currentTab === 'Order History'" class="order-history">
                <div v-if="loadingOrders" class="no-orders">
                    <p>Loading...</p>
                </div>

                <div v-else-if="orderHistory.length === 0" class="no-orders">
                    <p>No Order History</p>
                </div>
            <div v-else class="order-list">
                <div v-for="(order, orderIndex) in orderHistory" :key="orderIndex" class="order-box">
                <h3>Order #{{ orderIndex + 1 }}</h3>
                <div v-for="item in order" :key="item.id" class="order-item">
                    <img :src="item.image" :alt="item.name" class="item-image" />
                    <div class="item-details">
                    <a :href="item.link" target="_blank">{{ item.name }}</a>
                    <p>Price: ${{ (item.discount_price ?? item.actual_price).toFixed(2) }}</p>
                    </div>
                </div>
                </div>
            </div>
            </div>

        <!-- Payment Methods -->
            <div v-if="currentTab === 'Payment Methods'" class="payment-methods">
                <div v-if="cards.length === 0">
                    <p>No Payment Methods on File</p>
                </div>
                <div v-else>
                    <div v-for="(card, index) in cards" :key="index" class="card-box">
                        <p><strong>Card Holder:</strong> {{ card.cardHolder }}</p>
                        <p><strong>Card Number:</strong> **** **** **** {{ card.cardNumber.slice(-4) }}</p>
                        <p><strong>Expiry:</strong> {{ card.expiryDate }}</p>
                    </div>
            </div>

            <button @click="showCardForm = !showCardForm">
            {{ showCardForm ? 'Cancel' : 'Add Payment Method' }}
            </button>

            <div v-if="showCardForm" class="card-entry-form">
                <input v-model="newCard.cardHolder" placeholder="Name on Card" />
                <span class="error" v-if="cardErrors.cardHolder">{{ cardErrors.cardHolder }}</span>

                <input v-model="newCard.cardNumber" placeholder="Card Number" />
                <span class="error" v-if="cardErrors.cardNumber">{{ cardErrors.cardNumber }}</span>

                <input v-model="newCard.expiryDate" placeholder="MM/YY" />
                <span class="error" v-if="cardErrors.expiryDate">{{ cardErrors.expiryDate }}</span>

                <input v-model="newCard.csv" placeholder="CSV" />
                <span class="error" v-if="cardErrors.csv">{{ cardErrors.csv }}</span>
                <button @click="saveCard">Save Card</button>
            </div>
        </div>
    </div>
    </div>
</template>
  
  
<script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
  import { app } from '@/firebase';
  import { logoutUser } from '@/services/logoutService';
  import apiServices from '@/services/apiServices';
  import router from '@/router';
  
    export default 
    {
        data() 
        {
            return {
                user: null,
                userDetails: {},
                editableUserDetails: {},
                errors: {},
                editMode: false,
                currentTab: 'Account Overview',
                tabs: ['Account Overview', 'Order History', 'Payment Methods'],
                countries: ['Canada', 'USA'],

                showCardForm: false,
                newCard: {
                cardHolder: '',
                cardNumber: '',
                expiryDate: '',
                csv: ''
                },
                cards: [],

                cardErrors: {
                cardHolder: '',
                cardNumber: '',
                expiryDate: '',
                csv: ''
                },

                orderHistory: [],
                loadingOrders: true,
            };
        },
        created() 
        {
            const auth = getAuth(app); //Get user auth
            onAuthStateChanged(auth, async (user) => {
                if (user) //Make sure they are authed
                {
                    this.user = user;
                    await this.fetchUserDetails(user.uid);
                    await this.fetchCards();
                    await this.loadOrderHistory();
                } 
                else //Otherwise return them to the login page
                {
                    router.push('/login');
                }
            });
        },
        methods: {
            async fetchUserDetails(uid) //Get the users id
            {
                const db = getFirestore(app);
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) //Grab all thier info if they exist in the database
                {
                    this.userDetails = docSnap.data();
                    this.editableUserDetails = JSON.parse(JSON.stringify(this.userDetails));
                    this.updateProvinces();
                } 
                else //Otherwise log the error
                {
                    console.log("No user data found!");
                }
            },
            editProfile() //Toggles edit
            {
                this.editMode = true;
                this.editableUserDetails = JSON.parse(JSON.stringify(this.userDetails));
                this.errors = {};
            },
            async saveProfile() //Save the information in fields
            {
                if (this.validateForm()) //Only proceed if the all information editted is still valid
                {
                    const db = getFirestore(app);
                    const docRef = doc(db, "users", this.user.uid);
                    try
                    {
                        await updateDoc(docRef, this.editableUserDetails);
                        this.userDetails = JSON.parse(JSON.stringify(this.editableUserDetails));
                        this.editMode = false; //Disable editting after save success
                    } 
                    catch (error) //Log the rror
                    {
                        console.error("Failed to update user details:", error);
                    }
                } 
                else 
                {
                    console.error("Field validation failed!"); //Debug, validation failed
                }
            },
            cancelEdit() //Functionality to cancel editting
            {
                this.editableUserDetails = JSON.parse(JSON.stringify(this.userDetails));
                this.editMode = false;
            },
            logout() 
            {
                logoutUser().then(() => {
                    router.push('/login');
                }).catch(error => {
                    console.error("Failed to logout", error);
                });
            },
            validateField(field)  //Validation logic (same as the login)
            {
                if (field === 'email') 
                {
                    this.errors.email = this.editableUserDetails.email && /@.*\.(com|ca|net)$/.test(this.editableUserDetails.email.trim()) ? '' : 'Invalid email address.';
                } 
                else if (field === 'firstName') 
                {
                    this.errors.firstName = this.editableUserDetails.firstName && /^[a-zA-Z]+$/.test(this.editableUserDetails.firstName.trim()) ? '' : 'First name must contain only letters.';
                } 
                else if (field === 'lastName') 
                {
                    this.errors.lastName = this.editableUserDetails.lastName && /^[a-zA-Z]+$/.test(this.editableUserDetails.lastName.trim()) ? '' : 'Last name must contain only letters.';
                } 
                else if (field === 'address') 
                {
                    this.errors.address = this.editableUserDetails.address && /^\d+\s[A-Za-z\s]+$/.test(this.editableUserDetails.address.trim()) ? '' : 'Address must start with numbers followed by the street name.';
                } 
                else if (field === 'city') 
                {
                    this.errors.city = this.editableUserDetails.city && /^[a-zA-Z\s]+$/.test(this.editableUserDetails.city.trim()) ? '' : 'City must contain only letters.';
                } 
                else if (field === 'postalcode') 
                {
                    this.errors.postalcode = this.editableUserDetails.postalcode && this.editableUserDetails.postalcode.trim().length > 4 ? '' : 'Postal/Zip Code must be at least 5 characters.';
                } 
                else if (field === 'province') 
                {
                    this.errors.province = this.editableUserDetails.province.trim() ? '' : 'Please select a province or state.';
                } 
                else if (field === 'country') 
                {
                    this.errors.country = this.editableUserDetails.country.trim() ? '' : 'Please select a country.';
                } 
                else if (field === 'telephone') 
                {
                    this.errors.telephone = this.editableUserDetails.telephone && /^\d{10}$/.test(this.editableUserDetails.telephone.trim()) ? '' : 'Telephone must be 10 digits.';
                }
            },
            validateForm() //function to validate each field
            {
                this.validateField('email');
                this.validateField('password');
                this.validateField('firstName');
                this.validateField('lastName');
                this.validateField('address');
                this.validateField('postalcode');
                this.validateField('city');
                this.validateField('province');
                this.validateField('country');
                this.validateField('telephone');
                return Object.values(this.errors).every(error => !error);
            },
            updateProvinces() 
            {
                if (this.editableUserDetails.country === 'Canada')
                {
                    this.provinces = ['Ontario', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'British Columbia', 'Prince Edward Island', 'Saskatchewan', 'Alberta', 'Newfoundland and Labrador'];
                } 
                else if (this.editableUserDetails.country === 'USA') 
                {
                    this.provinces = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
                } 
            },
            async loadOrderHistory() //Load the users order history using API
            {
                this.loadingOrders = true;
                try 
                {
                    const response = await apiServices.getOrderHistory(this.user.uid);
                    this.orderHistory = Array.isArray(response) ? response : []; //If the response is not incorrect form, it will just make it empty to avoid runtime errs
                    console.log('Loaded order history:', this.orderHistory);
                } 
                catch (error)
                {
                    console.error("Failed to load order history:", error);
                    this.orderHistory = [];
                } 
                finally 
                {
                    this.loadingOrders = false;
                }
            },
            async saveCard() //Function which saves the card to the database
            {
                if (this.validateCardForm())
                {
                    const db = getFirestore(app);
                    const userId = this.user.uid;
                    const cardsRef = collection(db, 'users', userId, 'paymentCards');
                    try 
                    {
                        await addDoc(cardsRef, this.newCard);
                        this.newCard = { cardHolder: '', cardNumber: '', expiryDate: '', csv: ''};
                        this.showCardForm = false;
                        await this.fetchCards(); //Update the card list
                    } 
                    catch (err) 
                    {
                        console.error("Failed to save card:", err); //Debug error
                    }
                }
            },
            async fetchCards() //Function to fetch the preexisting cards from the databse
            {
                const db = getFirestore(app);
                const userId = this.user.uid;
                const cardsRef = collection(db, 'users', userId, 'paymentCards');
                try 
                {
                    const querySnapshot = await getDocs(cardsRef);
                    this.cards = querySnapshot.docs.map(doc => doc.data());
                } 
                catch (error) 
                {
                    console.error("Failed to fetch cards:", error); //Debug message
                }
            },
            validateCardForm() //Validates the card entries
            {
                const { cardHolder, cardNumber, expiryDate, csv } = this.newCard;
                let valid = true;

                if (!cardHolder.trim() || !/^[a-zA-Z\s]+$/.test(cardHolder)) // Card holder name: only letters and spaces
                {
                    this.cardErrors.cardHolder = 'Name must contain only letters and spaces.';
                    valid = false;
                } 
                else 
                {
                    this.cardErrors.cardHolder = '';
                }

                if (!/^\d{16}$/.test(cardNumber))  //Make sure the card num is 16 digits
                {
                    this.cardErrors.cardNumber = 'Card number must be 16 digits.';
                    valid = false;
                } 
                else 
                {
                    this.cardErrors.cardNumber = '';
                }

                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) //Make sure date format MM/YY
                {
                    this.cardErrors.expiryDate = 'Expiry date must be in MM/YY format.';
                    valid = false;
                } 
                else 
                {
                    this.cardErrors.expiryDate = '';
                }

                if (!/^\d{3,4}$/.test(csv)) //Make sure CSV is 3 to 4 digits
                {
                    this.cardErrors.csv = 'CSV must be 3 or 4 digits.';
                    valid = false;
                } else {
                    this.cardErrors.csv = '';
                }

                return valid;
            }
        },
        watch: 
        {
            'editableUserDetails.country'(newval) 
            {
                this.updateProvinces();
            }
        }
    };
</script>
  
  
  
<style scoped>

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ SIDEBAR \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */

    .profile-layout 
    {
        display: flex;
        height: 100vh;
        min-height: 100vh; 
    }

    .sidebar 
    {
        position: fixed;
        width: 200px; 
        background-color: #0077CA; 
        height: 100%;
        color: white;
        box-sizing: border-box;
        flex-direction: column; 
        overflow: hidden;
        position: sticky;
    }

    .sidebar ul 
    {
        list-style: none;
        padding: 5px;
        margin-bottom: 0; 
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
    }

    .sidebar ul li 
    {
        padding: 12px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
    }

    .sidebar ul li:last-child 
    {
        margin-bottom: 0; 
    }

    .sidebar ul li.active 
    {
        background-color: #E75D2A; 
        color: white; 
    }

    .sidebar ul li:hover 
    {
        background-color: #005991; 
        color: #FFF; 
    }

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\PROFILE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */

    .content 
    {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch; 
        padding: 20px;
        height: 100%;
    }

    .profile-container {
        width: 100%;
        flex-grow: 1;
        font-size: 16px;
        border: 1px solid #ccc;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 5px;
    }

    .profile-container h1 {
        margin-bottom: 24px;
        font-weight: bold;
        font-size: 32px;
    }

    .profile-container p, .profile-container .form-group 
    {
        margin-bottom: 24px;
        font-size: inherit;
    }

    .profile-container p strong, .profile-container .form-group label 
    {
        font-weight: bold;
    }

    .profile-container input[type="text"], .profile-container select 
    {

        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }


    .button-group 
    {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }


    button 
    {
        padding: 10px 20px;
        background-color: #003C71;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover 
    {
        background-color: #014d8f;
    }

    .error 
    {
        color: red;
        font-size: 0.40em;
        margin-left: 10px;
    }

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ORDER HISTORY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
    
.order-history 
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
    }
    .no-orders 
    {
        height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        color: #555;
    }

    .order-list 
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    .order-box 
    {
        width: 90%;
        margin: 20px 0;
        border: 2px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .order-item 
    {
        display: flex;
        align-items: center;
        margin: 10px 0;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }

    .order-item:last-child 
    {
        border-bottom: none;
    }

    .item-image 
    {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 20px;
        border-radius: 4px;
    }

    .item-details 
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
    }

    .item-details a 
    {
        font-weight: bold;
        color: #003C71;
        text-decoration: none;
        margin-bottom: 5px;
    }

    .item-details a:hover
    {
        text-decoration: underline;
        color: #E75D2A;
        outline: none;
        box-shadow: none
    }


/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\PAYMENT METHODS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */

    .payment-methods 
    {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;  
        font-size: 28px;
        font-weight: bold;
    }

    .payment-methods > * {
        margin-top: 20px; 
        border: 2px solid #0259a5; 
        padding: 10px; 
        width: 80%; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        border-radius: 5px; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        text-align: center;
    }

    .payment-methods > *:first-child 
    {
        margin-top: 0; 
    }

    .card-box 
    {
        margin-top: 10px;
        padding-bottom: 10px;
        border: 4px solid #33d10b;
        border-radius: 5px;
        width: 80%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-entry-form 
    {
        border: 2px solid #0077CA;
        border-radius: 12px;
        padding: 20px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
    }

    .card-entry-form input 
    {
        padding: 12px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: border 0.2s ease;
    }

    .card-entry-form input:focus 
    {
        outline: none;
        border-color: #0077CA;
        box-shadow: 0 0 0 3px rgba(0, 119, 202, 0.2);
    }

    .card-entry-form button 
    {
        background-color: #0077CA;
        color: white;
        padding: 12px;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .card-entry-form button:hover 
    {
        background-color: #005a9e;
    }

</style>
  
  
  
  
  
  
  



  