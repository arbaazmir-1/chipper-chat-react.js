import React,{useEffect,useLayoutEffect} from 'react'
import Lottie from "lottie-react";
import welcome from '../assets/lottie/welcome.json'
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {Timestamp,setDoc,doc} from "firebase/firestore";
import { auth,db } from "../../firebase";
import { Fragment, useRef, useState } from 'react'
import {CheckCircleIcon} from '@heroicons/react/24/outline'
import tick from '../assets/lottie/tick.json'
import { useNavigate } from "react-router-dom";




function LoginPage() {
    const provider = new GoogleAuthProvider();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sucess, setSucess] = useState(false);
    const navigate = useNavigate();
    


    useLayoutEffect(() => {
const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
        navigate('/home');
    }
    else {
        navigate('/login');

    }
}
)
return unsubscribe;


    },[])

    


    const signInWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const ref = doc(db, "users", user.email)
            setDoc(ref, {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                lastSeen: Timestamp.now(),
                uid: user.uid
            }, { merge: true })
            .then(() => {
                setLoading(false);
                //set sucess to true for 3 seconds
                setSucess(true);
                setTimeout(() => {
                    setSucess(false);
                    navigate('/home');
                }
                , 3000);

                
                
            }
            )
            .catch((error) => {
                setLoading(false);
                setError(error);
                console.error("Error writing document: ", error);
            }
            );

        })
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            setLoading(false);
            setError(error);
            
        });


    }
  return (

    <div className='w-full h-screen  flex justify-center items-center'>

        {/** create a modal for success */}
        {sucess && (
            
            <div className="fixed z-10 inset-0 overflow-y-auto" id="modal-container">
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
    
    <div className="inline-block align-bottom  rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    
        <div className="sm:flex sm:items-start">
          
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
           
            <div className="mt-2">
             <Lottie animationData={tick} />
            </div>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</div>

        )}
       

       
       <div className=' w-1/2 h-full  flex flex-col justify-center '>
            <h1 className='text-4xl font-bold text-center font-mono'>Welcome Back, We missed you!
            </h1>
            <div className='flex justify-center items-center'>
               
               <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-10' 
                onClick={signInWithGoogle}
               >
                <i className="fa fa-google"></i>{' '}
                Sign in with Google</button>
               
            </div>
            
        </div>

        <div className='w-1/2 h-full  flex justify-center items-center'>
            <Lottie animationData={welcome} />
        </div>



    </div>
  )
}

export default LoginPage