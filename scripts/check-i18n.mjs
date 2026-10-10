// Verifies that the `es` and `en` trees of every translation section have the
// same shape. Run with `npm run check:i18n`; exits non-zero on any mismatch, so
// a missing English string fails like a broken build instead of silently
// rendering `undefined`.
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const sectionsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'sections')

function leafKeys(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key))
}

let sections = 0
let keys = 0
const problems = []

for (const file of readdirSync(sectionsDir).filter((f) => f.endsWith('.js')).sort()) {
  const module = await import(pathToFileURL(join(sectionsDir, file)).href)
  const name = Object.keys(module)[0]
  const { es, en } = module[name] ?? {}

  if (!es || !en) {
    problems.push(`${file}: missing an "es" or "en" tree`)
    continue
  }

  const esKeys = leafKeys(es).sort()
  const enKeys = leafKeys(en).sort()
  const onlyEs = esKeys.filter((k) => !enKeys.includes(k))
  const onlyEn = enKeys.filter((k) => !esKeys.includes(k))

  sections++
  keys += esKeys.length

  if (onlyEs.length || onlyEn.length) {
    if (onlyEs.length) problems.push(`${file}: only in es -> ${onlyEs.join(', ')}`)
    if (onlyEn.length) problems.push(`${file}: only in en -> ${onlyEn.join(', ')}`)
  }
}

if (problems.length) {
  console.error(`i18n mismatch in ${problems.length} place(s):`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`i18n OK: ${sections} sections, ${keys} keys each in es and en`)
