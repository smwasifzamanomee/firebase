import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import firebaseConfig from './firebase/firebase.config';


const App = () => {
  const [user, setUser] = useState(null);
  console.log(user)

  useEffect(() => {
    // Initialize Firebase app

    initializeApp(firebaseConfig);

    // Listener for changes in user authentication state
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider)
      .then(() => {
        getRedirectResult(auth)
          .then((result) => {
            const user = result.user;
            setUser(user);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const handleSignOut = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        // Sign out successful
        setUser(null);
      })
      .catch((error) => {
        // An error occurred during sign out
        console.error(error);
      });
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <img className='rounded-full' src={user.photoURL} alt={user.displayName} />
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-blue-500'>Sign In with Google</p>
          <button className='border border-black rounded' onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
};

export default App;
