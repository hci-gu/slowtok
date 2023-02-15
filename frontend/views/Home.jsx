import { useContext, useEffect, useState, } from 'react'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import styles from '../styles/Home.module.css'

import { useGoogleLogin } from 'react-use-googlelogin'

import Dashboard from '../views/Dashboard'
import StreamThumb from '../components/StreamThumb'

import { fetchToken } from '../services/api'
import useFeatured from '../hooks/api/useFeatured'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

import AuthContext from '../contexts/auth'

const Featured = () => {
  const featured = useFeatured()
  return <div className={styles.featured}>
      { featured && featured.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
  </div>
}

const SignIn = () => {
  const { setToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [ error, setError ] = useState(null)
  const onSuccess = res => {
    setLoading(true)
    fetchToken(res.tokenId)
      .then(token => {
        if (token.token) {
          setToken(token.token)
        }
      })
      .catch(() => {})
      .then(() => setLoading(false))
  }

  const onFailure = res => {
    console.log('loggin failed', res)
    setError(res)
  }

  const { googleUser, isSignedIn, signIn } = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    uxMode: 'redirect'
  })

  useEffect(() => {
    if (isSignedIn && googleUser) {
      onSuccess(googleUser)
    } 
  }, [isSignedIn])

  const doSignIn = async () => {
    try {
      const result = await signIn()
      onSuccess(result)
    } catch (err) {
      onFailure(err)
    }
  }

  if (error) {
    return <>Error {error}</>
  }

  return <div className={styles.loginPage}>
    <button onClick={doSignIn} disabled={loading}>Sign in with Google</button>
    <Featured />
  </div>
}

const LoggedIn = () => {
  return <div className={styles.homeIndex}>
    <Dashboard />
  </div>
}

const LoggedOut = () => {
  return <div className={styles.homeIndex}><SignIn /></div>
}

const Home = () => {
  const { token } = useContext(AuthContext)

  if (token) {
    return <LoggedIn />
  } else {
    return <LoggedOut />
  }
}

export default Home
