import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Login = () => {

    const {form, changed} = useForm({})
    const [saved, setSaved] = useState("not_sent")

    const loginUser = async(e) => {
        e.preventDefault()

        let userToLogin = form

        // backend request
        const request = await fetch(Global.url+'user/login', {
            method: 'POST',
            body: JSON.stringify(userToLogin),
            headers: {
                'Content-Type':'application/json'
            }
        })

        const data = await request.json()
        
        
        if (data.status == 'success'){
            
            // Save token in local storage
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
            
            setSaved('login')
        }
        else{
            setSaved('error')
        }
    }


  return (
    <>
        <header className="content__header content__header--public">
            <h1 className="content__title">Login</h1>
        </header>
        <div className="content__posts">
            {saved== 'login' ?
            <strong className='alert alert-success'> Sign-in successfully!</strong>
            : ''}
            {saved== 'error' ? 
            <strong className='alert alert-warning'> Error in sign-in </strong>
            : ''} 
            <form className='form-login' onSubmit={loginUser}>
                <div className='form-group'>
                    <label htmlFor = 'email'>Email</label>
                    <input type='email' name='email' onChange={changed}/>
                </div>
                <div className='form-group'>
                    <label htmlFor = 'password'>Password</label>
                    <input type='password' name='password' onChange={changed}/>
                </div>
                <input type='submit' value= 'Sign-in' className='btn btn-success' />
                
            </form>

        </div>
    </>
  )
}
