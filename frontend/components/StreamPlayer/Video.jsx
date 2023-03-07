import { AbsoluteFill, useCurrentFrame } from 'remotion'
import dayjs from 'dayjs'
import styles from '../../styles/Anim.module.css'

const Video = ({ images }) => {
  const frame = useCurrentFrame()
  const image = images[frame]

  return (
    <AbsoluteFill>
      <div className={styles.datestamp}>
        <div className={styles.datestampContent}>
          {dayjs(images[frame].time).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
      <img
        src={image.url}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </AbsoluteFill>
  )
}

export default Video
