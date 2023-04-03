import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc ,setDoc,Timestamp,addDoc,collection,updateDoc,arrayUnion} from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";


import Navbar from "../components/Navbar";
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sucess, setSucess] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("q"));
    setLoading(true);
    const docRef = doc(db, "users", searchParams.get("q"));

    const docSnap = getDoc(docRef).then((doc) => {
        
        if (doc.exists()) {
            console.log("Document data:", doc.data());
            setUsers([doc.data()])
            setLoading(false);


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setLoading(false);
        }
        }
    );


  }, [searchParams]);

  const addFriend =async () => {
    //  addDoc(collection(db, "chats"), {
    //     users: [
    //         {
    //             email: auth.currentUser.email,
    //             name: auth.currentUser.displayName,
    //             photo: auth.currentUser.photoURL,
    //         },
    //         {
    //             email: searchParams.get("q"),
    //             name: users[0].name,

    //             photo: users[0].photo,

    //         }
    //     ],
    //     messages: [],
    // }, { merge: true })
    // .then(async(docRef) => {
    //     console.log("Document written with ID: ", docRef.id);

    //check if user is searching for himself
    if(auth.currentUser.email === searchParams.get("q")){
        return;
    }
    try{
        
        const addedfriend = await updateDoc(doc(db, "users", searchParams.get("q")), {
            friendsRequest:  arrayUnion( {
                email: auth.currentUser.email,
                name: auth.currentUser.displayName,
                photo: auth.currentUser.photoURL,
                
            })
               
            
        })
    
        const addedfriend2 = await updateDoc(doc(db, "users", auth.currentUser.email), {
            friendsRequestSent: arrayUnion({
                email: searchParams.get("q"),
                name: users[0].name,
                photo: users[0].photo,
                
    
            } )
        })
        console.log("Document successfully updated!");
        setSucess(true);
    }catch(e){
        console.error("Error updating document: ", e);
    }


   

    


   

  }

  return (
    <>
      <Navbar />

      <div className="w-full h-fit flex flex-col items-center m-2">
      <Transition show={sucess} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setSucess(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Friend Request Sent
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your friend request has been sent successfully.
                  </p>
                </div>

                <div className="mt-4 flex flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setSucess(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
      <div className="w-full h-fit flex flex-col items-center m-2">
        <h1 className="text-2xl font-mono">Search Results for {search}</h1>
      </div>

      <div
        className="w-full user-list 
        h-screen flex flex-col items-center m-2">
        <h1 className="text-2xl font-mono">Users</h1>
        {users?.map((user) => {
            return (
                <div className="w-4/5 m-2 flex flex-row justify-between items-center">
                    <h1 className="text-xl font-mono">{user.name}</h1>
                    <button className="bg-blue-500 text-white font-mono rounded-md p-2"
                    onClick={addFriend}
                    >Add Friend</button>
                    </div>
            )
        })}
        {users.length === 0 && !loading && <h1 className="text-2xl font-mono m-10">No Users Found</h1>}
        {loading && <h1 className="text-2xl font-mono">Loading...</h1>}

      </div>
    </>
  );
}

export default SearchPage;
