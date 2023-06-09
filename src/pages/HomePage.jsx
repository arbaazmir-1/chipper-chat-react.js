import React from "react";
import Navbar from "../components/Navbar";
import { auth } from "../../firebase";
import { useState ,useEffect} from "react";
import { doc, onSnapshot,getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ChatComponent from "../components/ChatComponent";
import { useNavigate } from "react-router-dom";
function HomePage() {

  const [friends, setFriends] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState("");
  const [reset , setReset] = useState(false);
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);
  const [error , setError] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true);
        const docRef = doc(db, "users", user.email);
        const unsub = onSnapshot(docRef, (doc) => {
          setFriends(doc.data()?.friends ?? []);
          setLoading(false);
          console.log(doc.data()?.friends);
        });

        return unsub;
        
      } else {
        setLoading(false);
        setFriends([]);

      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, []);



  const openChat = (id) => {
    setShowChat(true);
    setChatId(id);
    
    
  }
  return (
    <div className="w-full h-screen ">
      <Navbar />
      <div className="rest-container w-full flex justify-between items-center ">
        <div className="w-1/4 h-full shadow-md rounded-2xl md:flex flex-col items-center friend-list overflow-scroll hidden">
          <div className="w-full h-full flex flex-col  items-center">
            <h1 className="text-2xl font-mono my-5">Friends</h1>
            {friends?.map((friend) => {
              return (
                <div
                  className="w-4/5 m-2 
                    h-fit-content p-2 bg-white rounded-2xl flex flex-row justify-between items-center shadow-md cursor-pointer"
                  onClick={() => {
                    openChat(friend.chatId);
                  }}

                >
                  <div className="w-1/4 h-full flex justify-center items-center">
                    <img
                      src={friend.photo ? friend.photo : "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="w-3/4 h-full flex flex-col justify-center items-start">
                    <h1 className="text-lg font-mono">{friend.name}</h1>
                    <p className="text-sm font-mono">{friend.lastSeen}</p>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="w-full h-full flex justify-center items-center">
                <i className="fa fa-spinner fa-spin text-3xl"></i>
                <p>Loading</p>
              </div>
            )}
            {error && (
              <div className="w-full h-full flex justify-center items-center">
                <p>Something went wrong</p>
                </div>
            )}
          </div>
        </div>
        
        {showChat && (
          <ChatComponent chatId={chatId} />
        )}
          

       
      </div>
    </div>
  );
}

export default HomePage;
