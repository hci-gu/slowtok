import { useContext, useState } from 'react'
import { useGoogleLogin } from 'react-use-googlelogin'

import AuthContext from '../contexts/auth'

import { fetchToken } from '../services/api'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

const LoginButton = () => {
  const { setToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const { signIn } = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    // uxMode: 'redirect'
  })

  const doLogin = async () => {
    try {
      const res = await signIn()
      setLoading(true)
      fetchToken(res.tokenId)
        .then(token => {
          if (token.token) {
            setToken(token.token)
          }
        })
        .catch(() => {})
        .then(() => setLoading(false))

    } catch (err) {
      // onFailure(err)
    }

  }

  return <div onClick={doLogin} disabled={loading}>login</div>
}

export default LoginButton
