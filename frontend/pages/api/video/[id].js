import { bundle } from '@remotion/bundler'
import { getCompositions, renderMedia } from '@remotion/renderer'
import dayjs from 'dayjs'
import path from 'path'

let bundleLocation
const getBundle = async () => {
  const entry = './components/StreamPlayer/remotion.jsx'
  console.log('Creating a Webpack bundle of the video')
  bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  })
}

const getStream = async (id) => {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = new Date().toISOString().slice(0, 10)
  const response = await fetch(
    `https://api.slowtok.com/streams/${id}/images?from=${from}&to=${to}`
  )
  const data = await response.json()
  return data
}

export default async (req, res) => {
  const { id } = req.query
  console.log('render video', id)
  const compositionId = 'Stream'

  if (!bundleLocation) {
    await getBundle()
  }

  const images = await getStream(id)

  // Parametrize the video by passing arbitrary props to your component.
  const inputProps = {
    images,
  }

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    inputProps,
  })

  // Select the composition you want to render.
  const composition = comps.find((c) => c.id === compositionId)

  // Ensure the composition exists
  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`)
  }

  const outputLocation = `out/${compositionId}.mp4`
  console.log('Attempting to render:', outputLocation)
  const video = await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    inputProps,
  })
  console.log('Render done!')

  res.setHeader('Content-Type', 'video/mp4')
  res.setHeader('Content-Length', video.length)
  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"')
  res.end(video)
}
