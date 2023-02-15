import Link from 'next/link'
import { useRouter } from 'next/router'

import LoginButton from './LoginButton'
import useAuthToken from '../hooks/useAuthToken'

import styles from '../styles/Header.module.css'

const Header = () => {
  const token = useAuthToken()
  const router = useRouter()

  return <div className={styles.header}>
    <div className={styles.headerContent}>
      <Link href="/"><div className={styles.headerTitle}>SlowTok</div></Link>
      { !token && <div className={styles.headerActions}>
        { router.pathname !== '/' && <LoginButton /> }
      </div>}
    </div>
  </div>
}

export default Header
