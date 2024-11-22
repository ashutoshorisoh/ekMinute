import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
    const navigate = useNavigate();
    const {logout, isAuthenticated} = useAuth()

    const handleLoginRoute=()=>{

        navigate('/login')
      }
    
      const handleCreatorRoute=()=>{
        
        navigate('/userspage')
      }
      const handleRegisterRoute=()=>{
        navigate('/register')
      }
      const handleHomeRoute=()=>{
        navigate('/')
      }
  return (
    <div className='sticky top-0 z-10'>
      <div className=' flex justify-end gap-5 bg-black   min-w-full p-5 ml-[-10] '>
      <button onClick={handleHomeRoute} className=' pl-5 flex text-center text-white  pr-5 pb-3 pt-3 rounded-lg'>Home</button>
      <button onClick={handleCreatorRoute} className=' pl-5 flex text-center text-white  pr-5 pb-3 pt-3 rounded-lg'>Creators</button>
     


      {
  !isAuthenticated ? (
    <>
      <button onClick={handleLoginRoute} className='pl-5 flex text-center text-white pr-5 pb-3 pt-3 rounded-lg'>
        Login
      </button>
      <button onClick={handleRegisterRoute} className='pl-5 flex text-center text-white pr-5 pb-3 pt-3 rounded-lg'>
        Register
      </button>
    </>
  ) : (
    <button onClick={handleLoginRoute} className='pl-5 flex text-center text-white pr-5 pb-3 pt-3 rounded-lg'>
        Logout
      </button>
  )
}



      </div>
    </div>
  )
}

export default Navbar