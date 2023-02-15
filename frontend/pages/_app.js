import AuthContext from '../contexts/auth'
import useLocalStorage from '../hooks/useLocalStorage'
import dynamic from 'next/dynamic'

// setup dayjs
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.extend(utc)

const DynamicLoggedInFooter= dynamic(() => import('../components/LoggedInFooter'), { ssr: false})
import Header from '../components/Header'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useLocalStorage('token', null)

  const auth = {
    token,
    setToken,
  }

  return <AuthContext.Provider value={auth}>
    <Header />
    <Component {...pageProps} />
    { token && <DynamicLoggedInFooter />}
  </AuthContext.Provider>
}

export default MyApp
