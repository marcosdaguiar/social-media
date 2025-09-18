import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    
    const { setAuth, setCounters } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from local storage
        localStorage.clear()

        // set global state to empty object
        setAuth({})
        setCounters({})

        // Navigate to login
        navigate('/login')
    },);
  
    return (
    <h1>Logging Out...</h1>
  )
}
