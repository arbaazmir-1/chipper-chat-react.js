import React, { useEffect } from "react";
import { auth, db } from "../../firebase";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  onSnapshot,
  arrayRemove,
} from "firebase/firestore";

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [friendRequest, setFriendRequest] = useState([]);

  const handleSearch = () => {
    if (search.trim() === "") alert("Please enter a valid search query");
    else navigate(`/search?q=${search}`);
  };

  const solutions = [
    {
      name: "Profile",
      description: "Edit or View your profile",
      href: "#",
      icon: UserIcon,
    },
    {
      name: "Friends",
      description: "View your friends",
      href: "#",
      icon: UserGroupIcon,
    },
    {
      name: "Logout",
      description: "Logout of your account",

      icon: UserIcon,
      onClick: () => {
        auth
          .signOut()
          .then(() => {
            navigate("/login");
          })
          .catch((error) => {
            alert(error.message);
          });
      },
    },
  ];

  useEffect(() => {

    if(auth.currentUser!== undefined && auth.currentUser!== null){
    const unsub = onSnapshot(
      doc(db, "users", auth?.currentUser?.email),
      (doc) => {
        setFriendRequest(doc.data().friendsRequest);
        console.log(doc.data().friendsRequest);
      }
    );
    return unsub;
    }
  }, [
    auth?.currentUser,
  ]);

  return (
    <div className="w-full h-20 shadow-sm flex flex-row justify-between items-center">
      <div className="w-1/4 h-full flex justify-center items-center">
        <Link to="/home">
          <h1 className="text-2xl font-mono">Chipper</h1>
        </Link>
      </div>

      <div className="w-1/4 h-full flex justify-center items-center search-bar">
        <input
          type="email"
          placeholder="Search"
          className="w-3/4 h-10 rounded-full border-2 border-blue-500 outline-none px-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <button
          className=" text-white font-bold py-2 px-4 rounded-full ml-2"
          onClick={handleSearch}
        >
          <i className="fa fa-search text-blue-500"></i>
        </button>
      </div>

      <div className="w-1/4 h-full flex justify-center items-center avatar">
        <Popover className="relative mr-10">
          <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none">
            <i className="fa fa-bell text-blue-500"></i>
            {friendRequest?.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {friendRequest?.length}
              </span>
            )}

            
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {friendRequest?.map((item) => (
                    <div className="group relative flex justify-between gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <img
                          src={item.photo}
                          alt=""
                          className="w-10 h-10 rounded-full m-1"
                        />
                        <p className="mt-1 text-gray-600 m-1">{item.name}</p>
                      </div>
                      <div className="flex items-center justify-end gap-x-2">
                        <button
                          className="text-sm font-medium text-gray-500 hover:text-gray-900"
                          onClick={() => {
                            addDoc(
                              collection(db, "chats"),
                              {
                                users: [
                                  {
                                    email: auth.currentUser.email,
                                    name: auth.currentUser.displayName,
                                    photo: auth.currentUser.photoURL,
                                  },
                                  {
                                    email: item.email,
                                    name: item.name,

                                    photo: item.photo,
                                  },
                                ],
                                messages: [],
                              },
                              { merge: true }
                            )
                              .then(async (docRef) => {
                                console.log(
                                  "Document written with ID: ",
                                  docRef.id
                                );

                                const docRef1 = doc(
                                  db,
                                  "users",
                                  auth?.currentUser?.email
                                );
                                updateDoc(docRef1, {
                                  friends: arrayUnion({
                                    name: item.name,
                                    email: item.email,
                                    photo: item.photo,
                                    chatId: docRef.id,
                                  }),
                                  friendsRequest: arrayRemove(item),
                                });
                                const docRef2 = doc(db, "users", item.email);
                                const removeRequest = {
                                  name: auth?.currentUser?.displayName,
                                  email: auth?.currentUser?.email,
                                  photo: auth?.currentUser?.photoURL,
  };
                                updateDoc(docRef2, {
                                  friends: arrayUnion({
                                    name: auth?.currentUser?.displayName,
                                    email: auth?.currentUser?.email,
                                    photo: auth?.currentUser?.photoURL,
                                    chatId: docRef.id,
                                  }),
                                  
                                  friendRequestSent: arrayRemove(removeRequest),
                                });
                              })
                              .catch((error) => {
                                console.error("Error adding document: ", error);
                              });
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="text-sm font-medium text-gray-500 hover:text-gray-900"
                          onClick={() => {
                            const docRef = doc(
                              db,
                              "users",
                              auth?.currentUser?.email
                            );
                            updateDoc(docRef, {
                              friendsRequest: arrayRemove(item),
                            });
                            const docRef2 = doc(db, "users", item.email);
                            updateDoc(docRef2, {
                              friendRequestSent: arrayRemove({
                                name: auth?.currentUser?.displayName,
                                email: auth?.currentUser?.email,
                                photo: auth?.currentUser?.photoURL,
                              }),
                            });
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                  {friendRequest?.length === 0 && (
                    <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                      <div>
                        <p className="mt-1 text-gray-600">
                          No new friend requests
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <Popover className="relative">
          <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none">
            <img
              className="w-8 h-8 rounded-full"
              src={auth?.currentUser?.photoURL}
              alt="user avatar"
            />
            <span>{auth?.currentUser?.displayName}</span>
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {solutions.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <a
                          href={item.href ? item.href : ""}
                          className="font-semibold text-gray-900"
                          onClick={item.onClick ? item.onClick : ""}
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
}

export default Navbar;
