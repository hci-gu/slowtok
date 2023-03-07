import { Composition, getInputProps, registerRoot } from 'remotion'
import Video from './Video'

const Root = () => {
  const { images } = getInputProps()
  return (
    <>
      <Composition
        id="Stream"
        durationInFrames={images.length}
        fps={30}
        width={1280}
        height={720}
        component={() => <Video images={images} />}
      />
    </>
  )
}

registerRoot(Root)
