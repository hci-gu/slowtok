import { useState, useCallback, useEffect } from 'react'
import useAuthToken from '../useAuthToken'

import { fetchImages } from '../../services/api'

const useImages = ({ from, to, streamId }) => {
  const token = useAuthToken()
  const [images, setImages] = useState([])

  const doFetchImages = useCallback(() =>
    fetchImages({ token, streamId, from, to })
      .then(images => setImages(images))
    , [from, to, streamId])

  useEffect(() => {
    doFetchImages()
  }, [streamId])

  useEffect(() => {
    const interval = setInterval(doFetchImages, 1000 * 60 * 1) // every minute
    return () => clearInterval(interval)
  }, [streamId, doFetchImages])

  return images
}

export default useImages
