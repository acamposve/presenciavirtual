// Single source of truth for the privacy policy values that only the owner can
// provide. Nothing here is a guess: these are the values he supplied.
//
// Two of the seven values he gave are text read in the page's language - the
// retention period ("1 ano" / "1 year") and the last-updated date ("Octubre de
// 2026" / "October 2026") - so they live in src/i18n/sections/privacy.js, one
// per language, instead of in this language-neutral module.
//
// What stays here is language-neutral by nature: names, an address, a country
// and a governing law. Leaving a field empty still works exactly as before: the
// page renders `t.privacy.pendingValue` instead of the value and shows the draft
// notice before the hero while `missingPrivacyFields()` is not empty.
//
// The contact email is deliberately NOT here: it comes from CONTACT_INFO in
// src/i18n/translations.js, so it is not duplicated in two places.
export const PRIVACY_OWNER_DATA = {
  // Legal or business name of the person or company responsible for the data.
  legalName: 'Presencia Virtual',
  // Postal address of the controller.
  address: 'Av Garibaldi 2151, Montevideo, Uruguay',
  // Competent supervisory authority a visitor can complain to.
  supervisoryAuthority: 'Unidad Reguladora y de Control de Datos Personales',
  // Governing law / jurisdiction of the policy.
  jurisdiction: 'Uruguay',
  // Country where the site and the controller mailbox are hosted. It drives the
  // international-transfers section: without it, that section would be a claim
  // about where the data is processed that nobody has confirmed.
  hostingCountry: 'USA',
}

// The declaration order above is the render order and the contract the tests
// assert, so adding a field to the object is enough for it to be listed in the
// draft notice and (where the page renders it) shown to the visitor.
export const PRIVACY_FIELD_KEYS = Object.keys(PRIVACY_OWNER_DATA)

// Keys of the fields that still have no value. The optional `data` argument
// exists so the rules can be exercised over a filled object in the tests; the
// page always calls it with no arguments and therefore reads the real data.
// A value of only whitespace counts as missing.
export function missingPrivacyFields(data = PRIVACY_OWNER_DATA) {
  return PRIVACY_FIELD_KEYS.filter((key) => String(data[key] ?? '').trim() === '')
}
