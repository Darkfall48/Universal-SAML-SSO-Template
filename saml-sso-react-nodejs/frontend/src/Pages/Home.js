import React, { useState, useEffect } from "react"
import axios from "axios"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"

function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/profile`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome {user.nameID}</h2>
          <a href={`${BACKEND_URL}/logout`}>Logout</a>
        </div>
      ) : (
        <a href={`${BACKEND_URL}/login`}>Login with SAML</a>
      )}
    </div>
  )
}

export default Home
