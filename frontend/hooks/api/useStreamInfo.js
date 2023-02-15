import { useState, useEffect } from 'react'
import useAuthToken from '../useAuthToken'
import { fetchStreamInfo } from '../../services/api'

const useStreamInfo = ({ streamId }) => {
  const token = useAuthToken()
  const [info, setInfo] = useState(null)
  useEffect(() => {
    fetchStreamInfo({ token, streamId })
      .then(info => setInfo(info))
  }, [streamId])
  return info
}

export default useStreamInfo
