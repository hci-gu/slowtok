import Link from 'next/link'

import styles from '../styles/Dashboard.module.css'

import useStreams from '../hooks/api/useStreams'
import useFeatured from '../hooks/api/useFeatured'

import StreamThumb from '../components/StreamThumb'

const Dashboard = () => {
  const streams = useStreams()
  const featured = useFeatured()

  return <div className={styles.dashboard}>
    <h1>Hello</h1>

    <h2>Your streams</h2>
    <div>
      { streams && streams.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
      { streams && streams.length == 0 && <>
        <img style={{ display: 'block', width: '50%', margin: '0 auto' }} src='/undraw_videographer.svg' />
      </>}
    </div>
    <Link href='/streams/add'><div style={{ padding: 20, textDecoration: 'underline' }}>+ Add stream</div></Link>

    <h2>Featured streams</h2>
    <div>
      { featured && featured.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
    </div>
  </div>
}

export default Dashboard
