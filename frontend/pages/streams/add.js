import { useState } from 'react'
import { useRouter } from 'next/router'
import useAuthToken from '../../hooks/useAuthToken'

import styles from '../../styles/AddStream.module.css'

import FormErrorText from '../../components/FormErrorText'

import { registerStream } from '../../services/api'

const AddStreamPage = () => {
  const router = useRouter()
  const token = useAuthToken()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      await registerStream({ token, title, description: desc })
      router.back()
    } catch (_) {
      setError('something went wrong. try again.')
    } finally {
      setLoading(false)
    }
  }

  return <div className={styles.addStream}>
    <h1>Add stream</h1>
    <p>Excellent, you are about to start streaming something slowly.</p>
    <p>
      A stream is a series of images, typically spaced out over a significant period of time.
    </p>
    <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
    <textarea placeholder='Description' value={desc} onChange={e => setDesc(e.target.value)} />
    <button onClick={submit} disabled={loading}>Save</button>{ loading && '...'}
    {error && <FormErrorText>{error}</FormErrorText>}
    <div className={styles.bottom}><img src='/undraw_videographer.svg' /></div>
  </div>
}

export default AddStreamPage
