import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { projects, previewProjects, heroPreviews } from '../src/data.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(path.join(root, 'src/imageManifest.json'), 'utf8'))
const available = new Set(await readdir(path.join(root, 'public/assets/responsive')))
const checked = new Set()
const families = new Set()
for (const [canonical, entry] of Object.entries(manifest)) {
  assert.ok(entry.width > 0 && entry.height > 0, `Invalid dimensions: ${canonical}`)
  assert.ok(entry.sources.some(source => source.src === canonical), `Missing original: ${canonical}`)
  for (const source of entry.sources) assert.ok(source.width > 0, `Invalid source width: ${source.src}`)
  for (const src of [canonical, ...entry.sources.map(source => source.src), entry.thumbnail].filter(Boolean)) {
    families.add(src)
    await check(src)
  }
}
async function check(src) {
  assert.match(src, /^assets\/responsive\/[^/]+\.webp$/, `Use a relative responsive image path: ${src}`)
  assert.ok(available.has(path.posix.basename(src)), `Missing image or incorrect filename case: ${src}`)
  if (!checked.has(src)) assert.ok((await stat(path.join(root, 'public', src))).size > 0, `Empty image: ${src}`)
  checked.add(src)
}
const flatten = images => images.flatMap(image => image.columns ? image.columns.flat() : [image])
for (const project of [...projects, ...previewProjects]) {
  const paths = [project.cover, project.image, ...flatten(project.images || []).map(image => image.src), ...(project.videos || []).map(video => video.poster)].filter(Boolean)
  for (const src of paths) {
    await check(src)
    assert.ok(families.has(src), `Image absent from responsive manifest: ${src}`)
  }
}
for (const preview of heroPreviews) {
  await check(preview.image)
  assert.ok(families.has(preview.image), `Thumbnail absent from manifest: ${preview.image}`)
}
// Also verify unused variants so the complete packaged responsive folder is valid.
for (const filename of available) if (filename.endsWith('.webp')) await check('assets/responsive/' + filename)
console.log(`Image validation passed: ${Object.keys(manifest).length} families, ${checked.size} files; relative paths and exact filename case verified.`)
