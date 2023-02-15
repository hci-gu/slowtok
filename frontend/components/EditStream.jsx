import { useState, useCallback, useEffect, } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import useAuthToken from '../hooks/useAuthToken'
import { fetchStreamInfo, updateStream, deleteStream } from '../services/api'

import { FaChevronLeft } from 'react-icons/fa'
import styles from '../styles/EditStream.module.css'

const useStreamInfo = ({ streamId }) => {
  const token = useAuthToken()
  const [info, setInfo] = useState(null)
  useEffect(() => {
    fetchStreamInfo({ token, streamId })
      .then(info => setInfo(info))
  }, [streamId])
  return info
}

const Form = ({ title, description, onSave, saving }) => {
  const [titleValue, setTitle] = useState(title)
  const [descValue, setDesc] = useState(description)

  const submit = useCallback(() => {
    onSave({ title: titleValue, description: descValue })
  }, [titleValue, descValue])

  return <form onSubmit={e => e.preventDefault()}>
    <input value={titleValue} onChange={e => setTitle(e.target.value)} />
    <textarea value={descValue} onChange={e => setDesc(e.target.value)} />

    <button onClick={submit} disabled={saving}>Save</button>{ saving && '...'}
  </form>
}

const EditStream = ({ streamId }) => {
  const router = useRouter()
  const token = useAuthToken()
  const info = useStreamInfo({ streamId })
  const [saving, setSaving] = useState(false)

  const save = async ({ title, description }) => {
    setSaving(true)
    try {
      await updateStream({ token, streamId, title, description })
      router.back()
    } catch (e) { //
      console.log(e)
    }
    setSaving(false)
  }

  const onDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this stream?')
    if (confirmed) {
      console.log('will delete')
      await deleteStream({ token, streamId })
      router.push('/')
    }
  }

  return <div className={styles.editStream}>
    <Link href={`/stream?id=${streamId}`}><div style={{ marginTop: 30 }}><FaChevronLeft />Back to stream</div></Link>
    <h1>Edit stream</h1>
    {info && <Form {...info} onSave={save} saving={saving} />}
    <button className={styles.deleteButton} onClick={onDelete}>Delete stream</button>
    <div className={styles.bottom}>
      <img src='/undraw_Reviewed_docs.svg' />
    </div>
  </div>
}

export default EditStream
