// File handles logging out a user

import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase';


export function logoutUser() 
{
  const auth = getAuth(app);
  return signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
      return true;
    })
    .catch((error) => { //Catch error on signout
      console.error("Sign out error", error);
      throw error;
    });
}
