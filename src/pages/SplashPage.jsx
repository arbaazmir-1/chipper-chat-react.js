import React, { useEffect } from 'react'
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function SplashPage() {
    const navigate = useNavigate();
    useEffect(() => {

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

    }   ,[])
  return (
    <div className='w-full h-screen flex justify-center items-center '>

    <i className="fa fa-spinner fa-spin text-3xl"></i>
    <p>Loading</p>


    </div>
  )
}

export default SplashPage