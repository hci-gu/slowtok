import dayjs from 'dayjs'
import Link from 'next/link'

import { FaRegClock } from 'react-icons/fa'

import styles from '../styles/StreamThumb.module.css'

const WithLatest = ({ stream }) => {
  const fromNow = dayjs(stream.latest.time).fromNow(true)

  return <div className={styles.streamThumbImage} style={{ backgroundImage: `url(${stream.latest.url})` }}>
      {/* {date}<br />{time} */}
      <div style={{ display: 'inherit', marginRight: 5 }}><FaRegClock /></div>{fromNow}
    </div>
}

const WithoutLatest = () => {
  return <div className={styles.streamThumbImage}>Brand new</div>
}

const StreamThumb = ({ stream }) => {
  return <Link href={`/stream?id=${stream.id}`}>
    <div className={styles.streamThumb}>
      { stream.latest ? <WithLatest stream={stream} /> : <WithoutLatest />}
      <div className={styles.streamThumbTitle}>{stream.title}</div>
    </div>
  </Link>
}

export default StreamThumb
