import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom'

export const Followers = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)

  const params = useParams();

  let next = page + 1
  useEffect(() => {
    getUsers(1)
  }, [])

  const getUsers = async (nextPage = 1) => {
    //loading state
    setLoading(true)

    // get userId from url
    const userId = params.userId;


    let url1 = Global.url + "follow/followers/" + userId + "/" + nextPage

    // peticion para sacar usuarios
    const request = await fetch(url1, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    const data = await request.json()

    console.log("followers data", data)

    let cleanUsers = []
    data.followers.forEach(followers => {
      console.log(followers)
      cleanUsers = [...cleanUsers, followers.user]
    }
    )
    setLoading(false)

    // create a state to list users
    if (data.status == "success" && data.followers) {
      let newUsers = cleanUsers

      if (users.length >= 1) {
        newUsers = [...users, ...data.followers]
      }
      setUsers(newUsers)
      setFollowing(data.user_following)
      setLoading(false)
    }

    //pagination to load more users

    if (nextPage >= data.pages) {
      setMore(false)
    }
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Followers Users "username" </h1>
      </header>
      <UserList users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more={more}
        loading={loading}
        setPage={setPage}
        next={next}
      />
    </>
  )
}
