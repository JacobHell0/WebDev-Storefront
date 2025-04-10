<!-- FUNDAMENTAL COMPONENT - Allows user login and account creation - Uses firebase-->
 
<template>
    <div class="login-container">
        
        <h1 v-if="isLogin" class="center-text">Login</h1>
        <h1 v-else class="center-text">Sign Up</h1>

        <form @submit.prevent="isLogin ? loginUser() : registerUser()">
            <!-- Email and Password always visible -->
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="userDetails.email" :class="{'input-error': errors.email}" required>
                <span v-if="errors.email" class="error-message">Invalid email address.</span>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="userDetails.password" :class="{'input-error': errors.password}" required>
                <span v-if="errors.password" class="error-message">Password must be longer than 5 characters.</span>
            </div>
            <div v-if="!isLogin">
                <!--fields for registration -->
                <div class="form-group">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" v-model="userDetails.firstName" :class="{'input-error': errors.firstName}" required>
                    <span v-if="errors.firstName" class="error-message">First name must contain only characters.</span>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" v-model="userDetails.lastName" :class="{'input-error': errors.lastName}" required>
                    <span v-if="errors.lastName" class="error-message">Last name must contain only characters.</span>
                </div>
                <div class="form-group">
                    <label for="address">Street Address:</label>
                    <input type="text" id="address" v-model="userDetails.address" :class="{'input-error': errors.address}" required>
                    <span v-if="errors.address" class="error-message">Must be in form: 123 Example Lane</span>
                </div>
                <div class="form-group">
                    <label for="country">Country:</label>
                    <select id="country" v-model="userDetails.country" @change="updateProvinces" required>
                        <option value="">Select Country</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                    </select>
                    <span v-if="errors.country" class="error-message">Please select a country</span>
                </div>
                <div class="form-group">
                    <label for="province">Province/State:</label>
                    <select id="province" v-model="userDetails.province" required>
                        <option value="" disabled>Select Province/State</option>
                        <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                    </select>
                    <span v-if="errors.province" class="error-message">Please select a province or state</span>
                </div>
                <div class="form-group">
                    <label for="city">City:</label>
                    <input type="text" id="city" v-model="userDetails.city" :class="{'input-error': errors.city}" required>
                    <span v-if="errors.city" class="error-message">City must contain only characters</span>
                </div>
                <div class="form-group">
                    <label for="postalcode">Postal Code:</label>
                    <input type="text" id="postalcode" v-model="userDetails.postalcode" :class="{'input-error': errors.postalcode}" required>
                    <span v-if="errors.city" class="error-message">Must be atleast 5 characters</span>
                </div>
                <div class="form-group">
                    <label for="telephone">Telephone:</label>
                    <input type="text" id="telephone" v-model="userDetails.telephone" :class="{'input-error': errors.telephone}" required>
                    <span v-if="errors.telephone" class="error-message">Telephone must be numerical and 10 digits long</span>
                </div>
            </div>
            <!-- Buttons -->
            <div class="button-group">
                <button type="submit" class="left-button">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
                <button @click="toggleForm" type="button" class="right-button">{{ isLogin ? 'Sign up' : 'Return to Login' }}</button>
            </div>
            <div v-if="errors.general" class="general-error">
                <p class="error-message">{{ errors.general }}</p>
            </div>
        </form>
    </div>
</template>

  
  
<script>
    //Import Firebase functions for authentication and Firestore
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
    import { getFirestore, setDoc, doc } from 'firebase/firestore';
    import { app } from '@/firebase';
    import router from '@/router';

    export default 
    {
    data() 
    {
        return {
        isLogin: true,
        userDetails: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            address: '',
            postalcode: '',
            city: '', 
            province: '',
            country: '',
            telephone: ''
        },
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            address: '',
            postalcode: '',
            city: '', 
            province: '',
            country: '',
            telephone: '',
            general: '' //General means issues that arent related to fields (Network, invalid user/pass, etc)
        },
        provinces: []
        };
    },
    methods: {
        toggleForm() //Toggles bet sign up and login
        {
            this.isLogin = !this.isLogin;
            this.resetForm();
        },
        resetForm() //Function to reset fields and errors
        {
            Object.keys(this.userDetails).forEach(key => {
                this.userDetails[key] = '';
            });

            Object.keys(this.errors).forEach(key => {
                this.errors[key] = '';
            });
        },
        validateField(field) //Field validation
        {
            if (field === 'email') 
            {
                this.errors.email = this.userDetails.email && /@.*\.(com|ca|net)$/.test(this.userDetails.email) ? '' : 'Invalid email address.';
            } 
            else if (field === 'password') 
            {
                this.errors.password = this.userDetails.password && this.userDetails.password.length > 5 ? '' : 'Password must be longer than 5 characters.';
            } 
            else if (field === 'firstName') 
            {
                this.errors.firstName = this.userDetails.firstName && /^[a-zA-Z]+$/.test(this.userDetails.firstName) ? '' : 'First name must contain only letters.';
            } 
            else if (field === 'lastName') 
            {
                this.errors.lastName = this.userDetails.lastName && /^[a-zA-Z]+$/.test(this.userDetails.lastName) ? '' : 'Last name must contain only letters.';
            } 
            else if (field === 'address') 
            {
                this.errors.address = this.userDetails.address && /^\d+\s[A-Za-z\s]+$/.test(this.userDetails.address) ? '' : 'Address must start with numbers followed by the street name.';
            } 
            else if (field === 'city') 
            {
                this.errors.city = this.userDetails.city && /^[a-zA-Z\s]+$/.test(this.userDetails.city) ? '' : 'City must contain only letters.';
            } 
            else if (field === 'postalcode') 
            {
                this.errors.postalcode = this.userDetails.postalcode && this.userDetails.postalcode.length > 4 ? '' : 'Postal/Zip Code must be at least 5 characters.';
            }
            else if (field === 'province') 
            {
                this.errors.province = this.userDetails.province ? '' : 'Please select a province or state.';
            } 
            else if (field === 'country') 
            {
                this.errors.country = this.userDetails.country ? '' : 'Please select a country.';
            } 
            else if (field === 'telephone') 
            {
                this.errors.telephone = this.userDetails.telephone && /^\d{10}$/.test(this.userDetails.telephone) ? '' : 'Telephone must be 10 digits.';
            }
        },
        validateForm() //Check all fields
        {
            this.validateField('email');
            this.validateField('password');

            if (!this.isLogin) //Only check these if user is signing up
            {
                this.validateField('firstName');
                this.validateField('lastName');
                this.validateField('address');
                this.validateField('postalcode'); 
                this.validateField('city'); 
                this.validateField('province');
                this.validateField('country');
                this.validateField('telephone');
            }
            return Object.values(this.errors).every(error => !error); //Make sure all are valid
        },
        loginUser() 
        {
            this.errors.general = '';
            if (this.validateForm()) //Ensure fields are valid 
            {
                const auth = getAuth(app);
                signInWithEmailAndPassword(auth, this.userDetails.email, this.userDetails.password)
                .then(() => {
                console.log("Login success");
                router.push('/'); //Navigate to home page on successful login
                })
                .catch(error => {
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') 
                {
                    this.errors.general = "Invalid email or password."; //Invalid login
                } 
                else if (error.code === 'auth/network-request-failed') 
                {
                    this.errors.general = "Network error, please check your connection and try again."; //Network error message
                } 
                else 
                {
                    this.errors.general = "An unexpected error occurred. Please try again."; //Unhandled error
                }
                console.error("Login failure", error.message);
                });
            }
            else
            {
                console.log("Invalid data detected"); //debug message
            }
        },
        registerUser() 
        {
        if (this.validateForm()) 
        {
            const auth = getAuth(app);
            const db = getFirestore(app); //Init firestore
            createUserWithEmailAndPassword(auth, this.userDetails.email, this.userDetails.password)
            .then((userCredential) => {
                const uid = userCredential.user.uid; //Get user ID from auth
                const userRef = doc(db, "users", uid); //reference firestore doc
                
                //Create db entry
                return setDoc(userRef, {
                    email: this.userDetails.email,
                    firstName: this.userDetails.firstName,
                    lastName: this.userDetails.lastName,
                    address: this.userDetails.address,
                    postalcode: this.userDetails.postalcode,
                    city: this.userDetails.city,
                    province: this.userDetails.province,
                    country: this.userDetails.country,
                    telephone: this.userDetails.telephone
                });
            })
            .then(() => {
            console.log("Registration success");
            
            this.resetForm();

            router.push('/'); //Nav to home page on success reg
            })
            .catch(error => { //Output error on failure
            this.errors.general = "Registration failure, please check your network connection.";
            console.error("Registration failure", error.message);
            });
        } 
        else 
        {
            console.log("Validation of user data failed!"); //Debug
        }
        },
        updateProvinces() //Assigns all provinces or states to a country for drop downs
        {
            if (this.userDetails.country === 'Canada') 
            {
                this.provinces = ['Ontario', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'British Columbia', 'Prince Edward Island', 'Saskatchewan', 'Alberta', 'Newfoundland and Labrador'];
            } 
            else if (this.userDetails.country === 'USA') 
            {
                this.provinces = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            }
        }
    }
    };
</script>

<style scoped>
    .login-container 
    {
        width: 60%;
        max-width: 350px;
        margin: 50px auto;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        background-color: #fff;
    }

    .center-text 
    {
        text-align: center;
    }

    .form-group 
    {
        margin-bottom: 20px;
        position: relative;
    }

    label 
    {
        display: block;
        margin-bottom: 10px;
        font-size: 1em;
        color: #333;
    }

    input[type="email"], input[type="password"], input[type="text"], select 
    {
        width: 100%;
        padding: 12px;
        border: 2px solid #0077CA;
        border-radius: 8px;
        background-color: transparent;
        font-size: 1em;
        color: #333;
    }

    input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus, select:focus 
    {
        outline: none;
        border-color: #0077CA;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .error-message 
    {
        color: #ff0000;
        font-size: 0.85em;
        margin-top: 2px;
        display: block;
    }

    .button-group 
    {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .left-button, .right-button 
    {
        flex: 1;
        margin: 0 5px;
        padding: 10px 0;
        background-color: #0077CA;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .left-button:hover, .right-button:hover 
    {
        background-color: #E75D2A; 
    }

    .left-button:active, .right-button:active 
    {
        background-color: #b14720; 
    }

    .general-error 
    {
        text-align: center;
        margin-top: 10px;
    }

    /*Dark mode*/
    @media (prefers-color-scheme: dark) 
    {
        .login-container 
        {
            border-color: #0077CA; 
            background-color: #222; 
        }

        label, input[type="email"], input[type="password"], input[type="text"], select {
            color: #ddd;
        }

        input[type="email"], input[type="password"], input[type="text"], select {
            border-color: #0077CA;
        }

        input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus, select:focus {
            box-shadow: 0 0 0 2px rgba(72,169,248,0.5);
        }
    }

    /*screen size adjustment*/
    @media (min-width: 900px) 
    {
        .login-container 
        {
            max-width: 500px; 
            padding: 30px; 
        }
    }
</style>




