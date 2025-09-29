import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'

export const People = () => {
  const {auth} = useAuth()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  let next = page + 1
  useEffect(() => {
    getUsers(1)
  }, [])


  const getUsers = async (nextPage = 1) => {
    //loading state
    setLoading(true)
    let url1 = Global.url + "user/list/" + nextPage

    console.log("url1", url1) //good

    // peticion para sacar usuarios
    const request = await fetch(url1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    const data = await request.json()
    setLoading(false)

    console.log("status of data", data)

    // create a state to list users
    if (data.status == "success" && data.users) {
      console.log("success:" )
      let newUsers = data.users

      if (users.length >= 1) {
        newUsers = [...users, ...data.users]
      }
      setUsers(newUsers)
      setFollowing(data.pagination.user_following)
      setLoading(false)
    }
    console.log(data)

    // pagination to load more users

    console.log("next:", next, "total:", data.pagination.next)
    if (page >= data.pagination.next) {
      setMore(false)
    }
  }

  const nextPage = () => {
    
    setPage(next)
    getUsers(next)
  }

  const follow = async (userId) => {
    // backend call to save the follow
    console.log("Following user with ID:", userId); // Debugging line
    // backend call to save the follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    console.log("Follow request sent:", request); // Debugging line
    // get the response
    const data = await request.json()
    //verify if the user is already followed
    if (data.status == "success" && !following.includes(userId)) {
      setFollowing([...following, userId])
    }
    // update the following state, add the new userId
  }

  const unfollow = async (userId) => {
    // backend call to save the follow
    console.log("Unfollowing user with ID:", userId); // Debugging line
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
    console.log("Unfollow request sent:", request); // Debugging line

  }
    

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">People</h1>
      </header>

      <div className="content__posts">

        {loading ? <h1>Loading...</h1> : ""}
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.profilePicture != "default.png" && <img src={Global.url + "user/profile-picture/" + user.profilePicture} className="post__user-image" alt="Profile Picture" />}
                    {user.profilePicture == "default.png" && <img src={avatar} className="post__user-image" alt="Profile Picture" />}

                  </a>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{user.createdAt}</a>
                  </div>
                  <h4 className="post__content">{user.biography}.</h4>
                </div>

              </div>
              {user._id != auth._id &&
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
