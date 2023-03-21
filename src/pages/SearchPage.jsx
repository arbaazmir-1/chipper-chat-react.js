import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc ,setDoc,Timestamp,addDoc,collection,updateDoc,arrayUnion} from "firebase/firestore";

import Navbar from "../components/Navbar";
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
     addDoc(collection(db, "chats"), {
        users: [
            {
                email: auth.currentUser.email,
                name: auth.currentUser.displayName,
                photo: auth.currentUser.photoURL,
            },
            {
                email: searchParams.get("q"),
                name: users[0].name,

                photo: users[0].photo,

            }
        ],
        messages: [],
    }, { merge: true })
    .then(async(docRef) => {
        console.log("Document written with ID: ", docRef.id);
        
        const addedfriend = await updateDoc(doc(db, "users", searchParams.get("q")), {
            friends:  arrayUnion( {
                email: auth.currentUser.email,
                name: auth.currentUser.displayName,
                photo: auth.currentUser.photoURL,
                chatId: docRef.id
            })
               
            
        })
    
        const addedfriend2 = await updateDoc(doc(db, "users", auth.currentUser.email), {
            friends: arrayUnion({
                email: searchParams.get("q"),
                name: users[0].name,
                photo: users[0].photo,
                chatId: docRef.id
    
            } )
        })
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });



   

    


   

  }

  return (
    <>
      <Navbar />
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
        {loading && <h1 className="text-2xl font-mono">Loading...</h1>}

      </div>
    </>
  );
}

export default SearchPage;
