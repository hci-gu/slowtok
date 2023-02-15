import { useState, useEffect, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import styles from '../styles/Anim.module.css'

const AnimSlider = ({ images, frame, onChange }) => {
  const timelineImageDivide = images.length > 80 ? 4 : images.length > 40 ? 3 : images.length > 20 ? 2 : 1
  const numThumbs = Math.ceil(images.length / timelineImageDivide)
  const thumbContainerWidth = `${100 / numThumbs}%`
  const thumbWidth = timelineImageDivide > 1 ? `100%` : ''
  const thumbPos = index => `${index * 100 / numThumbs}%`

  const thumbFrame = Math.floor(frame / timelineImageDivide)
  const thumbImages = images.filter((_, i) => i % timelineImageDivide === 0)

  const cached = useMemo(() => ({}), [])

  for(var i=0;i<5;i++) {
    cached[thumbFrame + i] = true
  }

  console.log('cache', Object.keys(cached).length)

  return <div className={styles.sliderContainer}>
    <div className={styles.sliderContainerInner}>
      {thumbImages.map(({ url }, index) =>
        <div
          key={`sliderimg-${url}`}
          className={styles.sliderThumbContainer}
          style={{ left: thumbPos(index), width: thumbContainerWidth }}
        >
          { cached[index] && <img
            className={styles.sliderThumbnail}
            style={{ width: thumbWidth }}
            src={url}
          /> || <div className={styles.dot} />}
        </div>
      )}
      <input
        className={styles.slider}
        type='range'
        min={0}
        max={images.length - 1}
        value={frame}
        onChange={onChange}
      />
    </div>
  </div>
}

const Anim = ({ images }) => {
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  const cache = useMemo(() => ({}), [images])

  const fps = 3
  const timePerFrame = 1000/fps

  const nextFrame = useCallback(() => {
    if (images.length > 0) {
      setFrame(frame => {
        const newFrame = (frame + 1)
        if (newFrame >= images.length) {
          setPlaying(false)
          return frame
        }
        return newFrame
      })
    }
  }, [images, setFrame, playing])

  const onChange = useCallback(e => {
    setPlaying(false)
    setFrame(+e.target.value)
  }, [setPlaying, setFrame])

  const onClick = useCallback(() => {
    if (playing == false && frame == images.length - 1) {
      setFrame(0)
    }
    setPlaying(playing => !playing)
  }, [playing, setPlaying, frame, images])

  useEffect(() => {
    if (playing) {
      const interval = setInterval(nextFrame, timePerFrame)
      return () => clearInterval(interval)
    }
  }, [playing, nextFrame])

  // always show last frame as new images appear
  // useEffect(() => {
  //   if (!playing && frame == images.length - 2) {
  //     setFrame(images.length - 1) 
  //   }
  // }, [playing, frame, images])

  if (images.length == 0) {
    return <div>Loading...</div>
  }

  const frameIndex = frame % images.length
  for (var i=frameIndex; i < frameIndex + fps && i < images.length; i++) {
    if (!cache[i]) {
      cache[i] = new Image()
      cache[i].src = images[i].url
    }
  }

  // console.log('image url', images[frame % images.length].url)

  return <div className={styles.anim} onClick={onClick} style={{ position: 'relative' }}>
      <img className={styles.frameImage} src={images[frame % images.length].url} />
      {/* <div className={styles.frameImage} style={{ backgroundImage: `url(${images[frame % images.length].url})`}} /> */}
      <div className={styles.datestamp}><div className={styles.datestampContent}>{dayjs(images[frame % images.length].time).format('YYYY-MM-DD HH:mm')}</div></div>
      <div className={styles.controlbar}>
        <AnimSlider images={images} frame={frame} onChange={onChange} />
      </div>
    </div>
}

export default Anim
