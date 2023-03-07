import { Player } from '@remotion/player'
import { useEffect } from 'react'
import { prefetch } from 'remotion'
import Video from './Video'

const promiseSeries = (items, method) => {
  return items.reduce((promise, item) => {
    return promise.then((result) =>
      method(item).then(Array.prototype.concat.bind(result))
    )
  }, Promise.resolve([]))
}

const fetchImage = ({ url }) => {
  const { waitUntilDone } = prefetch(url, {
    method: 'blob-url',
  })
  return waitUntilDone
}

const StreamPlayer = ({ images }) => {
  // get width and height from the first image
  useEffect(() => {
    const progress = promiseSeries(images, fetchImage).then(() => {
      console.log('Prefetched all images')
    })
    console.log(progress)
  }, [images])

  return (
    <div>
      <Player
        component={() => <Video images={images} />}
        durationInFrames={images.length}
        fps={30}
        autoPlay
        compositionWidth={1280}
        compositionHeight={720}
        controls
        alwaysShowControls
        showVolumeControls={false}
        loop
      />
    </div>
  )
}

export default StreamPlayer
