import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import welcome from '../assets/lottie/welcome.json';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Timestamp, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import tick from '../assets/lottie/tick.json';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newSignIn, setNewSignIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user ) {
        console.log(newSignIn)
        if (newSignIn) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate('/home');
          }
          , 3000);
        }
        else {
          navigate('/home');
        }
      }
    });
    return unsubscribe;
  }, [navigate, newSignIn]);

  const signInWithGoogle = () => {
    setNewSignIn(true);
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoading(false);
        const user = result.user;
        const ref = doc(db, 'users', user.email);
        
        setDoc(
          ref,
          {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            lastSeen: Timestamp.now(),
            uid: user.uid,
          },
          { merge: true }
        )
          .then(() => {
            setLoading(false);
            // Set success to true for 3 seconds
            setSuccess(true);
            
            setTimeout(() => {
              setSuccess(false);
              navigate('/home');
              
            }, 3000);
            
          })
          .catch((error) => {
            setLoading(false);
            setError(error);
            console.error('Error writing document: ', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        setLoading(false);
        setError(error);
        console.error('Error signing in with Google: ', error);
      });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center font-mono mb-8">
        Welcome Back, We Missed You!
      </h1>

      <div className="flex justify-center items-center mb-8">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={signInWithGoogle}
        >
          <i className="fa fa-google"></i> Sign in with Google
        </button>
      </div>

      <div className="flex justify-center items-center">
        <Lottie animationData={welcome} />
      </div>

      {/* Success modal */}
      {success && (
        <div className="fixed z-10 inset-0 overflow-y-auto" id="modal-container">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm text-center">
              <div className="mb-4">
                <Lottie animationData={tick} />
              </div>
              <p className="text-lg font-medium">Success!</p>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed z-10 inset-0 overflow-y-auto w-full">
        <div className="flex items-center justify-center h-screen">
          <div className="bg-gray-100 opacity-70 w-full h-screen rounded-lg p-4 text-center flex justify-center items-center">
            <div className="mb-4">  
              <i className="fa fa-spinner fa-spin fa-3x"></i>
            </div>
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </div>
      </div>
      
      )}
      
    </div>
  );
}

export default LoginPage;
