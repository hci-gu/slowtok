import Link from 'next/link'

const NoImagesYet = ({ streamId }) =>
  <div style={{ margin: 40 }}>
    <img style={{ width: '100%' }} src='/undraw_upload_image.svg' />
    <p>Contrats! Time to add images.</p>
    <p><b>Upload an image:</b> You can upload an image directly in your browser by clicking <Link href={`/streams/upload?id=${streamId}`}><span style={{ textDecoration: 'underline' }}>here</span></Link>.</p>
    <p><b>Using streaming app:</b> Or you can download a streaming app and install on an old phone and place it in from of something you want to stream. This is the preferred option! <em>(Available soon)</em></p>
  </div>

export default NoImagesYet
