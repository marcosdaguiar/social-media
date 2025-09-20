import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../assets/img/user.png'
import { SerializeForm } from '../../helpers/SerializeForm'

export const Config = () => {
    const token = localStorage.getItem('token')
    const {auth, setAuth} = useAuth()

    const [saved, setSaved] = useState("not saved")
    const updateUser = async(e) =>{
        e.preventDefault()

        // Get data form
        let newDataUser = SerializeForm(e.target)
        
        // Remove empty fields
        delete newDataUser.file0

        // Send data to backend
        const request = await fetch(Global.url + 'user/update', {
            method: 'PUT',
            body: JSON.stringify(newDataUser),
            headers: {
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
        const data = await request.json()
        if (data.status == 'success' && data.user){
            delete data.user.password
            setAuth(data.user)

            setSaved('saved')
            console.log(auth);
        }
        else{
            setSaved('error')
        }

        // Upload profile picture
        const fileInput = document.querySelector('#file')
        if (data.status == 'success' && fileInput.files[0]){
            
            //get image form data
            const formData = new FormData()
            formData.append('file0', fileInput.files[0])
        
            // send image to backend
            const uploadRequest = await fetch(Global.url + 'user/upload-profile-picture', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': token
                }
            })
            const uploadData = await uploadRequest.json()
            console.log(uploadData);
            if (uploadData.status == 'success' && uploadData.user){
                delete uploadData.user.password
                // Update user data in context  
                setAuth(uploadData.user)
                setSaved('saved')
            }else{
                setSaved('error')
            }
        }
    }

  return (
    <>
        <header className="content__header content__header--public">
            <h1 className="content__title">Settings</h1>
        </header>

        <div className="content__posts">
            {saved== 'saved' ?
            <strong className='alert alert-success'> User updated successfully!</strong>
            : ''}
            {saved== 'error' ? 
            <strong className='alert alert-warning'> User was not updated </strong>
            : ''} 
            <form className='register-form' onSubmit={updateUser}>
                <div className='form-group'>
                    <label htmlFor='name'>First Name</label>
                    <input type='text' name='name' defaultValue={auth.name}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Last Name</label>
                    <input type='text' name='surname' defaultValue={auth.surname}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Username</label>
                    <input type='text' name='username' defaultValue={auth.username}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Biography</label>
                    <textarea name='biography' defaultValue={auth.biography}/>                    
                </div><div className='form-group'>
                    <label htmlFor='name'>Email</label>
                    <input type='email' name='email' defaultValue={auth.email}/>                    
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Password</label>
                    <input type='password' name='password' />                    
                </div>

                <div className='form-group'>
                    <label htmlFor='file0'>Profile Picture</label>
                    <div className='profile-picture'>
                        <div className="general-info__container-avatar">
                            {auth.profilePicture != "default.png" && <img src={Global.url+ "user/profile-picture/" +auth.profilePicture} className="container-avatar__img" alt="Foto de perfil"/>}
                            {auth.profilePicture == "default.png" && <img src={ avatar } className="container-avatar__img" alt="Profile Picture"/>}
                        </div>
                        <br/>
                    </div>
                    <input type='file' name='file0' id='file' />
                </div>
                <br/>
                <input type='submit' value='Save' className='btn btn-success'/>
            </form>

        </div>
    </>
  )
}
