// Single source of truth for the privacy policy values that only the owner can
// provide. Nothing here is a guess and nothing has a default: every field starts
// as an empty string on purpose, because inventing a legal name, an address, a
// retention period or a supervisory authority would be publishing a fact that
// nobody confirmed.
//
// Consequences of leaving a field empty (both are automatic, no component change
// is needed to publish the page):
//   1. src/pages/Privacy.jsx renders the value as `t.privacy.pendingValue`
//      ("Pendiente de completar" / "To be completed") instead of the value.
//   2. While at least one field is empty, the page shows the draft notice before
//      the hero and `missingPrivacyFields()` names what is left. The notice
//      disappears on its own once every field below has a value.
//
// The contact email is deliberately NOT here: it comes from CONTACT_INFO in
// src/i18n/translations.js, so it is not duplicated in two places.
export const PRIVACY_OWNER_DATA = {
  // Legal or business name of the person or company responsible for the data.
  legalName: '',
  // Postal address of the controller.
  address: '',
  // How long the contact-form messages are kept, as it should be read by a
  // visitor (free text, e.g. "3 años desde la última respuesta").
  retentionPeriod: '',
  // Competent supervisory authority a visitor can complain to.
  supervisoryAuthority: '',
  // Governing law / jurisdiction of the policy (e.g. "Uruguay").
  jurisdiction: '',
  // Country where the site and the controller mailbox are hosted. It drives the
  // international-transfers section: without it, that section would be a claim
  // about where the data is processed that nobody has confirmed.
  hostingCountry: '',
  // Date of the last update of the policy, written as it should be displayed.
  lastUpdated: '',
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
