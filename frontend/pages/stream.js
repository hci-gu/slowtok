import Stream from '../components/Stream'

const getSearchParam = name => {
  if (typeof window === 'undefined') {
    return null
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name)
}

const StreamPage = () => {
  const id = getSearchParam('id')

  return <Stream streamId={id} />
}

export default StreamPage
