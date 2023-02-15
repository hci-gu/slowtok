import { useContext, } from 'react'
// import { useGoogleLogout, } from 'react-google-login'
import { useGoogleLogin } from 'react-use-googlelogin'

import AuthContext from '../contexts/auth'

import styles from '../styles/footer.module.css'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID


const SignOut = () => {
  const { setToken } = useContext(AuthContext)
  const { signOut } = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
  })
  
  const doSignOut = async () => {
    try {
      await signOut()
      setToken(null)
    } catch (e) {
      console.log('unable to sign out', e)
    }
  }
  return  <div className={styles.logoutButton} onClick={doSignOut}>Logout</div>
}


const LoggedInFooter = () => {
  return <div className={styles.loggedInFooter}><SignOut /></div>
}

export default LoggedInFooter
