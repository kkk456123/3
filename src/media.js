import images from './imageManifest.json'

export const asset = path => import.meta.env.BASE_URL + path.replace(/^\/+/, '')

export function imageProps(path, sizes, thumbnail = false) {
  const image = images[path]
  if (!image) return { src: asset(path), decoding: 'async' }
  return {
    src: asset(thumbnail && image.thumbnail ? image.thumbnail : path),
    srcSet: thumbnail ? undefined : image.sources.map(source => `${asset(source.src)} ${source.width}w`).join(', '),
    sizes: thumbnail ? undefined : sizes,
    width: thumbnail ? 480 : image.width,
    height: thumbnail ? 270 : image.height,
    decoding: 'async',
  }
}
