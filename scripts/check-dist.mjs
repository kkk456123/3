import { readFile, stat } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { heroVideos } from '../src/data.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(path.join(root, 'src/imageManifest.json'), 'utf8'))
const paths = new Set(Object.entries(manifest).flatMap(([src, image]) => [src, ...image.sources.map(source => source.src), image.thumbnail].filter(Boolean)))
for (const src of [...paths, ...heroVideos]) {
  const original = await stat(path.join(root, 'public', src))
  const built = await stat(path.join(root, 'dist', src))
  assert.equal(built.size, original.size, `Missing or incomplete deployment asset: ${src}`)
}
const repository = process.env.GITHUB_REPOSITORY
if (repository) {
  const base = repository.endsWith('.github.io') ? '/' : '/' + repository.split('/').at(-1) + '/'
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8')
  assert.ok(html.includes(`src="${base}assets/`), `Incorrect deployment base; expected ${base}`)
}
console.log(`Deployment verified: ${paths.size} images, ${heroVideos.length} original-quality hero videos and repository base.`)
