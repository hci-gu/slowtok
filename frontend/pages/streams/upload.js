import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import { FaChevronLeft } from 'react-icons/fa'
import useAuthToken from '../../hooks/useAuthToken'

import { fetchUploadUrl } from '../../services/api'

import styles from '../../styles/Upload.module.css'
import useImages from '../../hooks/api/useImages'

const getSearchParam = name => {
  if (typeof window === 'undefined') {
    return null
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name)
}

const UploadPage = () => {
  const token = useAuthToken()
  const streamId = getSearchParam('id')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const fileInput = useRef()
  const lastImage = useRef()
  const images = useImages({ streamId, from: '2020-01-01', to: '2034-01-01' })

  useEffect(() => {
    if (lastImage?.current) {
      lastImage.current.scrollIntoView()
    }
  }, [lastImage.current])

  const onFilePicked = async e => {
    const file = e.target.files[0]

    setLoading(true)

    const uploadUrl = await fetchUploadUrl({ token, streamId, fileType: file.type })

    const uploadBuffer = (buffer) => {
      fetch(uploadUrl.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: buffer
      }).then(() => {
        setImageUrl(uploadUrl.downloadUrl)
      }).catch(e => {
        console.log(e)
      }).finally(() => setLoading(false))
    }

    const reader = new FileReader()
    reader.onload = () => {
      uploadBuffer(reader.result)
    }
    reader.readAsArrayBuffer(file)
  }

  const pickImage = () => {
    fileInput.current.click()
  }

  return <div className={styles.uploadPage}>
    <Link href={`/stream?id=${streamId}`}><div style={{ marginTop: 30 }}><FaChevronLeft />Back to stream</div></Link>
    <h1>Add image to stream</h1>
    <div>
      {imageUrl == null && <div className={styles.uploadContainer}>
        <button onClick={pickImage}>Take picture</button>
        <input ref={fileInput} type="file" accept="image/*" capture="camera" onChange={onFilePicked} />
      </div>}
      {loading && 'Loading...'}
      {imageUrl && <img style={{ width: '100%' }} src={imageUrl} />}
    </div>
    <div className={styles.images}>
      {images && images.map((image, i) => <img ref={i == images.length - 1 && lastImage || (() => {})} key={`${image.url}`} style={{ height: 60 }} src={image.url} />)}
      { images && images.length === 0 && 'Stream is empty' }
    </div>
  </div>
}

export default UploadPage
