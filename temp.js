import { createContext, useEffect, useMemo, useState } from 'react'
import { getDummyUser } from 'dummyData/user'
import { useLocation } from 'react-router-dom'
import { verifyToken } from 'utils/api/authApi'
import Spinner from 'components/common/spinner'

export const AuthContext = createContext(undefined)

const AuthProvider = ({ children }) => {
  const { pathname } = useLocation()
  const [user, setUser] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const { data } = await verifyToken()
      // console.log(userDetails)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      setUser({})
      setIsAuthenticated(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [pathname])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [user, isAuthenticated],
  )

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export default AuthProvider
