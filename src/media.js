import images from './imageManifest.json'

// Every variant resolves to its full responsive family, including explicit thumb paths.
const imageFamilies = Object.fromEntries(Object.entries(images).flatMap(([path, image]) =>
  [path, ...image.sources.map(source => source.src), image.thumbnail].filter(Boolean).map(src => [src, image]),
))

export const asset = path => import.meta.env.BASE_URL + path.replace(/^\/+/, '')

export function imageProps(path, sizes, thumbnail = false) {
  const image = imageFamilies[path]
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
