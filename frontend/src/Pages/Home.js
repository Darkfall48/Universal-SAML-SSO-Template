import React, { useState, useEffect } from "react"
import axios from "axios"

function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get("http://localhost:3001/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome {user.nameID}</h2>
          <a href="http://localhost:3001/logout">Logout</a>
        </div>
      ) : (
        <a href="http://localhost:3001/login">Login with SAML</a>
      )}
    </div>
  )
}

export default Home
