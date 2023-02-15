import { useState, useEffect, } from 'react'
import useAuthToken from '../useAuthToken'

import { fetchStreams } from '../../services/api'

const useStreams = () => {
  const [streams, setStreams] = useState(null)
  const token = useAuthToken()

  useEffect(() => {
    fetchStreams({ token })
      .then(streams => {
        if (streams.error) {
          //
        } else {
          setStreams(streams.sort((a, b) => (a?.latest?.time || "1") > (b?.latest?.time || "1") ? -1 : 1))
        }
      })
  }, [])

  return streams
}

export default useStreams
