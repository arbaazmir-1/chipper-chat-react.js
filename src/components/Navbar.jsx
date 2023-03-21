import React from 'react'
import { auth } from '../../firebase'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  UserIcon
  ,
  UserGroupIcon,
  
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]


function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if(search.trim() === "") alert("Please enter a valid search query");

    else  navigate(`/search?q=${search}`);

    
  }

const solutions = [
  {
    name: 'Profile',
    description: 'Edit or View your profile',
    href: '#',
    icon: UserIcon,

  },
  {
    name: 'Friends',
    description: 'View your friends',
    href: '#',
    icon: UserGroupIcon,
  },
  {
    name: 'Logout',
    description: 'Logout of your account',
    
    icon: UserIcon,
    onClick: () => {
      auth.signOut()
      .then(() => {
        navigate('/login');
      }
      )
      .catch((error) => {
        alert(error.message);
      }
      )
    },

  }
]
    

    
  return (
    <div className='w-full h-20 bg-blue-100 flex flex-row justify-evenly items-center'>
        <div className='w-1/4 h-full flex justify-center items-center'>
            <Link to='/home'>
            <h1 className='text-2xl font-mono'>Chipper</h1>
            </Link>
        </div>

        <div className='w-1/4 h-full flex justify-center items-center search-bar'>
            <input type="text" placeholder='Search' className='w-3/4 h-10 rounded-full border-2 border-blue-500 outline-none px-4'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <button className='bg-red-100 text-white font-bold py-2 px-4 rounded-full ml-2'
              onClick={handleSearch}
            >
            <i className="fa fa-search text-blue-500"></i>
            </button>
        </div>

        <div className='w-1/4 h-full flex justify-center items-center avatar'>
        <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none">
        <img
            className="w-8 h-8 rounded-full"
            src= {auth?.currentUser?.photoURL } 
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
                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                  </div>
                  <div>
                    <a href={item.href ? item.href : ''}  className="font-semibold text-gray-900"
                      onClick={item.onClick ? item.onClick : ''}
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
  )
}

export default Navbar