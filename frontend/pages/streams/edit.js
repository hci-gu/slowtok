import EditStream from '../../components/EditStream'

const getSearchParam = name => {
  if (typeof window === 'undefined') {
    return null
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name)
}

const EditStreamPage = () => {
  // const { id } = query
  const id = getSearchParam('id')

  return <EditStream streamId={id} />
}

export default EditStreamPage
