import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export const PublicLayout = () => {

  const {auth} = useAuth()
  return (
    <>
        {/* Layout */}
        <Header />
        {/* Principal Content */}
        <section className="layout__content">
          {!auth._id?
          <Outlet />
          : <Navigate to={'/social'} />
          }          
        </section>

    </>
  )
}
