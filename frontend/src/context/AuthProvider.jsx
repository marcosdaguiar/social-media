import React from 'react'
import { useState, useEffect, createContext } from 'react'
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      authUser();
    }, [])
  
    const authUser = async () => {
      // Get user data from local storage
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      // verify if I have token and user data
      if(!token || !user){
        setLoading(false)
        return false
      }
      
      // transform data to object
      const userObj = JSON.parse(user)
      const userId = userObj.id

      // Ajax to verify user data and get all user data
      const request = await fetch(Global.url+'user/profile/'+userId, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token
        }
      })
      const data = await request.json()

      //Get following and followers counters
      const requestCounters = await fetch(Global.url+'user/counter/'+userId, {
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token
        }
      })
      const dataCounters = await requestCounters.json()

      // set auth state
      if(data.status == 'success'){
        setAuth(data.user)
        setCounters(dataCounters)
        setLoading(false)
        return true
      }
      else{
        console.log("Error fetching user profile:", data);
        setAuth({})
        return false
      }
    }
    
    return (<AuthContext.Provider 
      value={{
        auth,
        setAuth,
        counters,
        loading,
        setCounters
        }}>
      
        {children}
    </AuthContext.Provider> )
}

export default AuthContext;