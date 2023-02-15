import Link from 'next/link'
import dayjs from 'dayjs'

import Anim from './Anim'

import useStreamInfo from '../hooks/api/useStreamInfo'
import useImages from '../hooks/api/useImages'

import {
  FaEdit,
  FaCloudUploadAlt,
} from 'react-icons/fa'
import NoImagesYet from './NoImagesYet'

import styles from '../styles/Stream.module.css'

const Description = ({ children }) => {
  console.log(children)
  return children.split('\n\n').map((para, i) => <p key={i}>{para}</p>)
}

const Stream = ({ streamId }) => {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = dayjs.utc().endOf('day').format() // '2020-12-24'

  const days = 100

  const info = useStreamInfo({ streamId })
  const images = useImages({ from, to, streamId: streamId || '' })

  const showTo = dayjs(info?.latest?.time)
  const showFrom = dayjs(showTo).subtract(days, 'day')
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(showFrom, showTo, null, '[]'))

  return <div className={styles.container}>
      <h1>
        { info?.title }
        { info?.owner && <>
          <Link href={`/streams/edit?id=${streamId}`}><span className={styles.actionIcon}><FaEdit /></span></Link>
          <Link href={`/streams/upload?id=${streamId}`}><span className={styles.actionIcon}><FaCloudUploadAlt /></span></Link>
        </> }
        
      </h1>      
      { showImages.length > 0 ? <Anim images={showImages} /> : null}
      { showImages.length == 0 && info?.owner && <NoImagesYet streamId={ streamId } />}
      { info && <Description>{info.description}</Description> }
    </div>
}

export default Stream
