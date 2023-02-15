import { useState, useEffect, } from 'react'
import useAuthToken from '../useAuthToken'

import { fetchFeatured } from '../../services/api'

const useFeatured = () => {
  const [streams, setStreams] = useState(null)
  const token = useAuthToken()

  useEffect(() => {
    fetchFeatured({ token })
      .then(streams => {
        if (streams.error) {
          //
        } else {
          setStreams(streams.sort((a, b) => (a.latest?.time || "1") > (b.latest?.time || "1") ? -1 : 1))
        }
      })
  }, [])

  return streams
}

export default useFeatured
