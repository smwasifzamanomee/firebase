import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from './firebase/firebase.config';

const App = () => {
  const [newUser, setNewUser] = useState(false);

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
  });

  useEffect(() => {
    initializeApp(firebaseConfig);

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
            const { user } = result.user;
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
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          password: '',
          photo: '',
          error: '',
          success: false
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user.email, user.password);

    if (newUser && user.email && user.password) {
      console.log('submitting')
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo);
          // ..
        });
    }

    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    };
  }

  const handleChange = (e) => {
    let isFieldValid;

    if (e.target.name === 'email') {
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      isFieldValid = isEmailValid;
      if (isFieldValid) {
        const newUserInfo = { ...user };
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
      }
    }
  };

  const handleChange1 = (e) => {
    let isFieldValid;

    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
      if (isFieldValid) {
        const newUserInfo = { ...user };
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
      }
    }
  };

  if (user === null) {
    // Render a loading state or spinner while Firebase initializes
    return <p>Loading...</p>;
  }



  return (
    <div className='flex justify-center items-center h-screen gap-20'>
      {user.isSignedIn ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <img className='rounded-full' src={user.photo} alt={user.name} />
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p className='text-blue-500'>Sign In with Google</p>
          <button className='' onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      )}
      <br />
      <div className=''>
        <h1 className='text-2xl font-bold'>Our own authentication</h1>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser">New User Sign Up</label>
        <form onSubmit={handleSubmit}>
          {newUser && <input
            name="text"
            type="name"
            placeholder="Enter your Name"
            className='py-4 p-4 mb-4 border rounded-xl border-black'
          />}
          <br />
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
            className='py-4 p-4 mb-4 border rounded-xl border-black'
          />
          <br />
          <input
            name="password"
            onChange={handleChange1}
            type="password"
            placeholder="Enter your password"
            className='py-4 p-4 mb-4 border rounded-xl border-black'
          />
          <br />
          <input type="submit" value="Submit" className='border border-orange-500' />
        </form>
        <p className='text-red-500'>{user.error}</p>
        {
          user.success && <p className='text-green-500'>User created successfully</p>
        }
      </div>
    </div>
  );
};

export default App;