import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Register = () => {

    const {form, changed} = useForm({})
    const [saved, setSaved] = useState("not_sent")

    const saveUser = async(e) =>{
        e.preventDefault()

        // get data from form
        let newUser = form

        // save user in backend
        const request = await fetch(Global.url + 'user/register', {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        } );
        const data = await request.json()

        if (data.status == "success"){
            setSaved('saved')
        }else{
            setSaved('error')
        }       
    }

  return (
    <>
        <header className="content__header content__header--public">
            <h1 className="content__title">Register</h1>
        </header>
        <div className="content__posts">
            {saved== 'saved' ?
            <strong className='alert alert-success'> User registered successfully!</strong>
            : ''}
            {saved== 'error' ? 
            <strong className='alert alert-warning'> User was not registered </strong>
            : ''} 
            <form className='register-form' onSubmit={saveUser}>
                <div className='form-group'>
                    <label htmlFor='name'>First Name</label>
                    <input type='text' name='name' onChange={changed}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Last Name</label>
                    <input type='text' name='surname' onChange={changed}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Username</label>
                    <input type='text' name='username' onChange={changed}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Email</label>
                    <input type='email' name='email' onChange={changed}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Password</label>
                    <input type='password' name='password' onChange={changed}/>                    
                </div>

                <input type='submit' value='Register' className='btn btn-success'/>
            </form>

        </div>
    </>
  )
}
