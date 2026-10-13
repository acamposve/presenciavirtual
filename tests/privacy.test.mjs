// Contract for the privacy policy page (`/privacy`).
//
// Why this file exists: this project has no renderer (no jsdom), so the rules
// that decide what a visitor sees are asserted against the sources. Two of them
// matter more than the rest:
//   - the page has to be reachable and linked from the places where personal
//     data is collected and where a legal link is expected (contact form,
//     footer, sitemap);
//   - while src/data/privacy.js still has empty fields, the draft notice has to
//     be there and has to come first, so the policy cannot be published
//     half-written without anyone noticing.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRIVACY_OWNER_DATA, PRIVACY_FIELD_KEYS, missingPrivacyFields } from '../src/data/privacy.js'
import { privacy } from '../src/i18n/sections/privacy.js'
import { footer } from '../src/i18n/sections/footer.js'
import { contact } from '../src/i18n/sections/contact.js'
import { meta } from '../src/i18n/sections/meta.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8')

const app = read('src', 'App.jsx')
const routeMeta = read('src', 'components', 'RouteMeta.jsx')
const footerSource = read('src', 'components', 'Footer.jsx')
const contactSource = read('src', 'pages', 'Contact.jsx')
const privacySource = read('src', 'pages', 'Privacy.jsx')
const privacyDataSource = read('src', 'data', 'privacy.js')
const sitemap = read('public', 'sitemap.xml')

// Fields the brief requires, plus the documented additions below.
const REQUIRED_OWNER_FIELDS = [
  'legalName',
  'address',
  'retentionPeriod',
  'supervisoryAuthority',
  'jurisdiction',
  'lastUpdated',
]
// Documented addition: the international-transfers section needs the hosting
// country to state a fact about where data is processed instead of a generality.
const EXTRA_OWNER_FIELDS = ['hostingCountry']

const EXPECTED_OWNER_FIELDS = [...REQUIRED_OWNER_FIELDS, ...EXTRA_OWNER_FIELDS].sort()

// The ten sections of the policy, in the order the page has to render them.
const SECTION_KEYS = [
  'controller',
  'data',
  'purposes',
  'retention',
  'recipients',
  'transfers',
  'rights',
  'cookies',
  'security',
  'changes',
]

// --- Route, metadata and links ---------------------------------------------

test('the /privacy route exists in App.jsx', () => {
  assert.match(app, /import Privacy from '\.\/pages\/Privacy'/, 'Privacy page is not imported in App.jsx')
  assert.match(
    app,
    /<Route path="\/privacy" element=\{<Privacy \/>\} \/>/,
    'the /privacy route is not registered in App.jsx',
  )
})

test('/privacy has its own metadata in es and en', () => {
  assert.match(routeMeta, /'\/privacy':\s*'privacy'/, 'RouteMeta has no entry for /privacy')
  for (const lang of ['es', 'en']) {
    assert.ok(meta[lang].privacy, `meta.${lang}.privacy is missing`)
    assert.ok(meta[lang].privacy.title.length > 0, `meta.${lang}.privacy.title is empty`)
    assert.ok(meta[lang].privacy.description.length > 0, `meta.${lang}.privacy.description is empty`)
    assert.notEqual(
      meta[lang].privacy.title,
      meta[lang].notFound.title,
      `meta.${lang}.privacy fell back to the 404 title`,
    )
  }
})

test('the footer legal block links to the privacy policy', () => {
  assert.match(footerSource, /<Link to="\/privacy">/, 'no link to /privacy in Footer.jsx')
  assert.match(footerSource, /t\.footer\.privacyLink/, 'the footer link does not use the i18n label')
  assert.match(footerSource, /t\.footer\.legalTitle/, 'the legal block has no heading')
  for (const lang of ['es', 'en']) {
    assert.ok(footer[lang].legalTitle.length > 0, `footer.${lang}.legalTitle is empty`)
    assert.ok(footer[lang].privacyLink.length > 0, `footer.${lang}.privacyLink is empty`)
  }
})

test('the sitemap lists /privacy', () => {
  assert.match(
    sitemap,
    /<loc>https:\/\/presenciavirtual\.net\/privacy<\/loc>/,
    '/privacy is not in public/sitemap.xml',
  )
})

test('the contact form shows a consent notice next to the submit button', () => {
  // The form is where personal data is collected, so the consent notice belongs
  // there and not only in the footer.
  const submitAt = contactSource.indexOf('type="submit"')
  const consentAt = contactSource.indexOf('form-consent')
  assert.ok(submitAt > -1, 'no submit button found in Contact.jsx')
  assert.ok(consentAt > -1, 'the consent notice is missing in Contact.jsx')
  assert.ok(consentAt > submitAt, 'the consent notice must come after the submit button')
  assert.match(contactSource, /<Link to="\/privacy">/, 'the consent notice does not link to /privacy')

  for (const lang of ['es', 'en']) {
    for (const key of ['consentBefore', 'consentLink', 'consentAfter']) {
      assert.ok(contact[lang][key], `contact.${lang}.${key} is missing`)
    }
  }
})

// --- Owner data contract ---------------------------------------------------

test('src/data/privacy.js declares every field the owner has to fill in', () => {
  assert.deepEqual(
    [...PRIVACY_FIELD_KEYS].sort(),
    EXPECTED_OWNER_FIELDS,
    'the set of owner fields changed: update this list deliberately when it does',
  )
  for (const key of EXPECTED_OWNER_FIELDS) {
    // Declared as a string literal in the source, so the file stays the single
    // editable place and no value is derived from somewhere else. Matching a
    // string (not only an empty one) keeps this true once the owner fills it in.
    assert.match(
      privacyDataSource,
      new RegExp(`\\b${key}:\\s*['"]`),
      `${key} is not declared as a string literal in src/data/privacy.js`,
    )
    assert.ok(key in PRIVACY_OWNER_DATA, `${key} is not a property of PRIVACY_OWNER_DATA`)
  }
})

test('the contact email is not duplicated in the privacy data module', () => {
  assert.ok(
    !privacyDataSource.includes('@'),
    'src/data/privacy.js looks like it hard-codes an email address; it must come from CONTACT_INFO',
  )
})

test('missingPrivacyFields(empty) reports every field', () => {
  assert.deepEqual(missingPrivacyFields({}), PRIVACY_FIELD_KEYS)
})

test('missingPrivacyFields(filled) reports nothing', () => {
  const filled = Object.fromEntries(PRIVACY_FIELD_KEYS.map((key) => [key, 'valor']))
  assert.deepEqual(missingPrivacyFields(filled), [])
})

test('missingPrivacyFields reports only the fields still empty, in declaration order', () => {
  const filled = Object.fromEntries(PRIVACY_FIELD_KEYS.map((key) => [key, 'valor']))
  const partial = { ...filled, address: '', lastUpdated: '   ' }
  assert.deepEqual(missingPrivacyFields(partial), ['address', 'lastUpdated'])
})

test('missingPrivacyFields treats whitespace, undefined and null as missing', () => {
  const filled = Object.fromEntries(PRIVACY_FIELD_KEYS.map((key) => [key, 'valor']))
  assert.deepEqual(missingPrivacyFields({ ...filled, legalName: '\t \n' }), ['legalName'])
  assert.deepEqual(missingPrivacyFields({ ...filled, legalName: undefined }), ['legalName'])
  assert.deepEqual(missingPrivacyFields({ ...filled, legalName: null }), ['legalName'])
})

// --- Draft notice ----------------------------------------------------------

test('every owner field has a label in es and en, so the draft notice can name it', () => {
  for (const key of PRIVACY_FIELD_KEYS) {
    for (const lang of ['es', 'en']) {
      const label = privacy[lang].fieldLabels[key]
      assert.equal(typeof label, 'string', `${lang}: no label for ${key}`)
      assert.ok(label.length > 0, `${lang}: empty label for ${key}`)
    }
  }
})

test('while the owner data is incomplete, the page shows the draft notice first', () => {
  const missing = missingPrivacyFields()
  if (missing.length === 0) {
    // The owner filled everything in: the notice takes itself out of the render,
    // which is the documented behaviour. Nothing left to guard here.
    return
  }

  assert.match(
    privacySource,
    /missingPrivacyFields\(\)/,
    'Privacy.jsx no longer reads missingPrivacyFields(): the draft notice cannot be trusted',
  )
  assert.match(privacySource, /privacy-draft-notice/, 'the draft notice markup is gone from Privacy.jsx')

  const noticeAt = privacySource.indexOf('privacy-draft-notice')
  const heroAt = privacySource.indexOf('<PageHero')
  assert.ok(heroAt > -1, 'Privacy.jsx does not render PageHero')
  assert.ok(
    noticeAt < heroAt,
    'the draft notice must render before the hero: an incomplete policy must be the first thing seen',
  )

  // The notice has to be able to list what is missing, and the page has to show
  // a pending value instead of blank space where a value is missing.
  for (const key of missing) {
    assert.ok(privacy.es.fieldLabels[key], `missing field ${key} has no label to show in the notice`)
  }
  assert.match(privacySource, /content\.pendingValue/, 'empty values do not render as pending')
})

// --- Sections --------------------------------------------------------------

test('the page renders the ten policy sections, in order, in both languages', () => {
  const positions = []
  for (const key of SECTION_KEYS) {
    for (const lang of ['es', 'en']) {
      const section = privacy[lang].sections[key]
      assert.ok(section, `${lang}: section "${key}" is missing`)
      assert.ok(section.title && section.title.length > 0, `${lang}.sections.${key}.title is empty`)
      assert.ok(
        Array.isArray(section.paragraphs) && section.paragraphs.length > 0,
        `${lang}.sections.${key}.paragraphs is empty: the section would render as a bare heading`,
      )
      assert.ok(Array.isArray(section.items), `${lang}.sections.${key}.items is not an array`)
      for (const text of [...section.paragraphs, ...section.items]) {
        assert.equal(typeof text, 'string', `${lang}.sections.${key} has a non-string entry`)
        assert.ok(text.length > 0, `${lang}.sections.${key} has an empty entry`)
      }
    }

    const at = privacySource.indexOf(`content.sections.${key}`)
    assert.ok(at > -1, `Privacy.jsx does not render the "${key}" section`)
    positions.push(at)
  }

  assert.deepEqual(
    [...positions].sort((a, b) => a - b),
    positions,
    'the sections are not rendered in the order the contract requires',
  )
})

test('the page states that data is not sold and covers the three third parties', () => {
  // The claim the /ai-consulting page already made, plus the third parties that
  // the code actually involves: hosting, Google Fonts and the registrar.
  const recipientsEs = JSON.stringify(privacy.es.sections.recipients)
  const recipientsEn = JSON.stringify(privacy.en.sections.recipients)
  assert.match(recipientsEs, /no vendemos tus datos/i)
  assert.match(recipientsEn, /do not sell your data/i)
  for (const text of [recipientsEs, recipientsEn]) {
    assert.match(text, /hosting/i)
    assert.match(text, /Google Fonts/)
    assert.match(text, /ResellersPanel/)
  }
})

test('the cookies section names pv-lang and denies tracking', () => {
  for (const lang of ['es', 'en']) {
    const cookies = JSON.stringify(privacy[lang].sections.cookies)
    assert.match(cookies, /pv-lang/, `${lang}: the local storage key is not named`)
    assert.match(cookies, /localStorage/, `${lang}: localStorage is not named`)
    assert.match(cookies, /anal[ií]tica|analytics/i, `${lang}: the no-analytics statement is missing`)
  }
})
