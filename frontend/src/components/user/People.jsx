import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'

export const People = () => {

  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers(1)
  }, [])


  const getUsers = async (nextPage = 1) => {
    //loading state
    setLoading(true)
    let url1 = Global.url + "user/list/" + nextPage

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

    // create a state to list users
    if (data.status == "success" && data.users) {
      let newUsers = data.users

      if (users.length >= 1) {
        newUsers = [...users, ...data.users]
      }
      setUsers(newUsers)
      setFollowing(data.pagination.user_following)
      setLoading(false)
    }

    // pagination to load more users
    if (page >= data.pagination.pages) {
      setMore(false)
    }
  }

  const nextPage = () => {
    let next = page + 1
    setPage(next)
    getUsers(next)
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

              <div className="post__buttons">
                {!following.includes(user._id) && 
                <a href="#" className="post__button post__button--green">
                  Follow
                </a>
                }
                
                {following.includes(user._id) &&                       
                <a href="#" className="post__button post__button">
                  Unfollow
                </a>
                } 
              </div>


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
