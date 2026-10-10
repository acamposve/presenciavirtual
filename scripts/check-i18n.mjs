// Verifies that the `es` and `en` trees of every translation section have the
// same shape, and that every section is registered in src/i18n/translations.js.
// Run with `npm run check:i18n`; exits non-zero on any mismatch, so a missing
// English string fails like a broken build instead of silently rendering
// `undefined`.
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const i18nDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n')
const sectionsDir = join(i18nDir, 'sections')

// Arrays descend too, so an index is part of the key ("home.whenItems.0.trigger").
// Treating an array as a leaf hid a length or inner-key mismatch in both trees.
function leafKeys(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((child, i) => leafKeys(child, prefix ? `${prefix}.${i}` : String(i)))
  }
  if (!value || typeof value !== 'object') return [prefix]
  return Object.entries(value).flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key))
}

// A section file that is never registered in translations.js passes the parity
// check but leaves `t.<section>` undefined at runtime, so check the registry too.
const translationsFile = join(i18nDir, 'translations.js')
const registry = readFileSync(translationsFile, 'utf8')

function isRegistered(name) {
  // Registered means both halves of the wiring are there: the import and the
  // entry in the `sections` object (e.g. `import { home } from './sections/home'`
  // plus `home,`). A shortened form ("home") is not accepted.
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`import\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}\\s*from`).test(registry)
    && new RegExp(`^\\s*${escaped}\\s*[,}]`, 'm').test(registry)
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

  if (!isRegistered(name)) {
    problems.push(`${file}: section "${name}" is not registered in src/i18n/translations.js (import + sections object)`)
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
