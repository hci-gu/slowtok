import { useContext } from 'react'

import AuthContext from '../contexts/auth'

const useAuthToken = () => {
  const { token } = useContext(AuthContext)
  return token
}

export default useAuthToken