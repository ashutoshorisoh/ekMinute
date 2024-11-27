import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();

    const handleLoginRoute = () => {
        navigate('/login');
    };

    const handleCreatorRoute = () => {
        navigate('/userspage');
    };

    const handleRegisterRoute = () => {
        navigate('/register');
    };

    const handleHomeRoute = () => {
        navigate('/');
    };

    const handleLogOut = () => {
        logout();  // Call logout function to clear authentication state
        navigate('/login');  // Redirect to login page
    };

    return (
        <div className="sticky top-0 z-10">
            <div className="flex lg:justify-end justify-center items-center lg:gap-5 gap-16 bg-black min-w-full p-5 ml-[-10]">
                <button onClick={handleHomeRoute} className="pl-5 border border-white flex text-center shadow-inner  text-white pr-5 pb-3 pt-3 rounded-md">Home</button>
                <button onClick={handleCreatorRoute} className="pl-5 border border-white flex text-center text-white pr-5 pb-3 pt-3 shadow-inner  rounded-md">Creators</button>

                {
                    !isAuthenticated ? (
                        <>
                            <button onClick={handleLoginRoute} className="pl-5 border border-white flex text-center text-white pr-5 pb-3 pt-3 shadow-inner  rounded-md">Login</button>
                            <button onClick={handleRegisterRoute} className="pl-5 border border-white flex text-center text-white pr-5 pb-3 pt-3 shadow-inner  rounded-md">Register</button>
                        </>
                    ) : (
                        <button onClick={handleLogOut} className="pl-5 border border-white flex text-center text-white pr-5 pb-3 pt-3 shadow-inner  rounded-md">Logout</button>
                    )
                }
            </div>
        </div>
    );
}

export default Navbar;
