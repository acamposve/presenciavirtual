// Domain search helpers, shared by the hero bar and the results page.
// Plain JS with no imports so `npm test` can load it directly in Node.

// A single label: 1-63 chars, letters/digits/hyphens, no leading or trailing hyphen.
const NAME_LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/
// A TLD, with room for the longest real ones (e.g. "southcarolina", 13 chars)
// and for a two-level suffix such as "com.uy".
const TLD_LABEL = /^[a-z]{2,24}(\.[a-z]{2,24})?$/

const MAX_LABELS = 5

function validName(name) {
  if (!name || name.length > 253) return false
  const labels = name.split('.')
  return labels.length > 0 && labels.length <= MAX_LABELS && labels.every((l) => NAME_LABEL.test(l))
}

function validTld(tld) {
  if (!tld || tld.length > 49) return false
  return TLD_LABEL.test(tld) && tld.split('.').every((l) => l.length <= 24)
}

// IDNs are typed in Unicode but the API and DNS only understand punycode, so
// "café.com" has to become "xn--caf-dma.com". The URL parser does that
// conversion and as a side effect strips scheme, port, credentials and path.
function asciiHost(input) {
  try {
    const url = new URL(`http://${input}/`)
    if (url.username || url.password) return null
    if (url.pathname !== '/') return null
    return url.hostname
  } catch {
    return null
  }
}

// Accepts "name" or "name.tld" (with or without scheme/www/path), in Unicode or
// punycode. Returns { name, tld } using the ASCII form, or null when invalid.
export function parseDomainQuery(raw) {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim().replace(/^https?:\/\//i, '')
  if (!trimmed) return null
  const input = trimmed.split(/[/?#]/)[0]
  if (!input) return null

  // The URL parser is also what normalises a bare Unicode name ("café" ->
  // "xn--caf-dma"); it rejects spaces and other invalid label characters.
  const host = asciiHost(input)
  if (!host) return null
  // "www." is a host prefix, not part of the name being registered.
  const bare = host.startsWith('www.') ? host.slice(4) : host

  // No dot: a bare name to look up across the popular TLDs.
  if (!bare.includes('.')) {
    return NAME_LABEL.test(bare) ? { name: bare, tld: '' } : null
  }

  // Split at the first dot that leaves a valid name on the left and a valid TLD
  // on the right, so two-level suffixes stay whole ("miempresa.com.uy" ->
  // name "miempresa", tld "com.uy" instead of name "miempresa.com", tld "uy").
  const parts = bare.split('.')
  for (let i = 1; i < parts.length; i++) {
    const name = parts.slice(0, i).join('.')
    const tld = parts.slice(i).join('.')
    if (validName(name) && validTld(tld)) return { name, tld }
  }
  return null
}

// Available alternatives to suggest when the requested domain is taken.
export function availableAlternatives(results, excludeDomain) {
  return (results || []).filter((r) => r && r.available === true && r.domain !== excludeDomain)
}
