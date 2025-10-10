import React from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'

export const UserList = ({ users, getUsers, following, setFollowing, more, loading, next, setPage }) => {
    const { auth } = useAuth()
    //let next = page + 1
    const follow = async (userId) => {
        // backend call to save the follow
        // backend call to save the follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        // get the response
        const data = await request.json()
        //verify if the user is already followed
        if (data.status == "success" && !following.includes(userId)) {
            setFollowing([...following, userId])
        }
        // update the following state, add the new userId
    }

    const nextPage = () => {
    
        setPage(next)
        getUsers(next)
    }

    const unfollow = async (userId) => {
        // backend call to save the follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        //verify if the user is already followed
        const data = await request.json()
        if (data.status == "success" && following.includes(userId)) {
            let filterFollowing = following.filter(followingUserId => userId !== followingUserId)
            setFollowing(filterFollowing)
        }

        // update the following state, remove the new userId
    }

    return (
        <>
            <div className="content__posts">

                {users.map((userOrFollow, index) => {
                    // Support either an array of user objects or an array of follow wrappers ({ user })
                    const user = userOrFollow? userOrFollow.user ?? userOrFollow : userOrFollow
                    // Fallback key: use user._id when available, otherwise index
                    const key = user && user._id ? user._id : `user-${index}`

                    return (
                        <article className="posts__post" key={key}>
                            <div className="post__container">

                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        {user && user.profilePicture != "default.png" && <img src={Global.url + "user/profile-picture/" + user.profilePicture} className="post__user-image" alt="Profile Picture" />}
                                        {(!user || user.profilePicture == "default.png") && <img src={avatar} className="post__user-image" alt="Profile Picture" />}
                                    </a>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{user?.name} {user?.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="" className="user-info__create-date">{user?.createdAt}</a>
                                    </div>
                                    <h4 className="post__content">{user?.biography}</h4>
                                </div>

                            </div>
                            {user && user._id != auth._id &&
                                <div className="post__buttons">
                                    {!following.includes(user._id) &&
                                        <a href="#" className="post__button post__button--green"
                                            onClick={() => follow(user._id)}
                                        >
                                            Follow
                                        </a>
                                    }

                                    {following.includes(user._id) &&
                                        <a href="#" className="post__button post__button"
                                            onClick={() => unfollow(user._id)}
                                        >
                                            Unfollow
                                        </a>
                                    }
                                </div>
                            }
                        </article>
                    )
                })}

            </div>
            {loading ? <h1>Loading...</h1> : ""}

            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage} >
                        Load More
                    </button>
                </div>
            }
        </>
    )
}
