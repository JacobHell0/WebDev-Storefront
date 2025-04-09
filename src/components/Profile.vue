<!-- This is a simple profile component to fetch the current users data (Debug Profile) -->

<template>
    <div class="profile-container" v-if="user">
      <h1>Profile</h1>
      <p><strong>First Name:</strong> {{ userDetails.firstName }}</p>
      <p><strong>Last Name:</strong> {{ userDetails.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Address:</strong> {{ userDetails.address }}</p>
      <p><strong>Postal Code:</strong> {{ userDetails.postalcode }}</p>
      <p><strong>City:</strong> {{ userDetails.city }}</p>
      <p><strong>Province/State:</strong> {{ userDetails.province }}</p>
      <p><strong>Country:</strong> {{ userDetails.country }}</p>
      <p><strong>Telephone:</strong> {{ userDetails.telephone }}</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  
  <script>
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, doc, getDoc } from 'firebase/firestore';
    import { app } from '@/firebase';
    import { logoutUser } from '@/services/logoutService';
    import router from '@/router';
    
    export default {
        data() 
        {
            return {
                user: null,
                userDetails: {}
            };
        },
        created() 
        {
            const auth = getAuth(app);
            onAuthStateChanged(auth, async (user) => {
                if (user) 
                {
                this.user = user;
                await this.fetchUserDetails(user.uid);
                }
                else 
                {
                    router.push('/login'); //If the user isnt logged in, redirect them to login
                }
            });
        },
        methods: 
        {
            async fetchUserDetails(uid) 
            {
                const db = getFirestore(app);
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);
        
                if (docSnap.exists()) 
                {
                    this.userDetails = docSnap.data();
                } 
                else 
                {
                    console.log("No user data found!");
                }
            },
            logout() 
            {
                logoutUser().then(() => {
                router.push('/login'); //Redirect to login page after logout
                }).catch(error => {
                console.error("Failed to logout", error);
                });
            }
        }
    };
  </script>
  
  
  <style scoped>
  .profile-container 
  {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh; 
      text-align: center;
      padding-top: 10vh; 
  }

  button 
  {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
  }

  button:hover 
  {
      background-color: #45a049;
  }
</style>


  