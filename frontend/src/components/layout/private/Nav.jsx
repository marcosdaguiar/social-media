import React from 'react'
import avatar from '../../../assets/img/user.png';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';



export const Nav = () => {

    const {auth} = useAuth()


    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to='/social' className="menu-list__link">
                        <i className="fa-solid fa-house"></i>
                        <span className="menu-list__title">Home</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/social/feed' className="menu-list__link">
                        <i className="fa-solid fa-list"></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/social/people' className="menu-list__link">
                        <i className="fa-solid fa-user"></i>
                        <span className="menu-list__title">People</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <i className="fa-regular fa-envelope"></i>
                        <span className="menu-list__title">Messages</span>
                    </a>
                </li>
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <a href="#" className="list-end__link-image">
                        {auth.profilePicture != "default.png" && <img src={Global.url+ "user/profile-picture/" +auth.profilePicture} className="list-end__img" alt="Profile Picture"/>}
                        {auth.profilePicture == "default.png" && <img src={ avatar } className="list-end__img" alt="Profile Picture"/>}
                    </a>
                </li>
                <li className="list-end__item">
                    <a href="#" className="list-end__link">
                        <span className="list-end__name">{auth.username}</span>
                    </a>
                </li>
                <li className="list-end__item">
                    <NavLink to='/social/settings' className="list-end__link">
                        <i className="fa-solid fa-gear"></i>
                        <span className="list-end__name">Settings</span>
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <NavLink to="/social/logout" href="#" className="list-end__link">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span className="list-end__name">Log Out</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
