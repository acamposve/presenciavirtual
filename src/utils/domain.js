// Domain search helpers, shared by the hero bar and the results page.
// Plain JS with no imports so `npm test` can load it directly in Node.

// A single label: 1-63 chars, letters/digits/hyphens, no leading or trailing hyphen.
const NAME_LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/
// A TLD, with room for the longest real ones (e.g. "southcarolina", 13 chars)
// and for a two-level suffix such as "com.uy".
const TLD_LABEL = /^[a-z]{2,24}(\.[a-z]{2,24})?$/

function validTld(tld) {
  if (!tld || tld.length > 49) return false
  return TLD_LABEL.test(tld) && tld.split('.').every((l) => l.length <= 24)
}

// IDNs are typed in Unicode but the API and DNS only understand punycode, so
// "café.com" has to become "xn--caf-dma.com". The URL parser does that
// conversion and as a side effect strips scheme, port and path. Embedded
// credentials ("user:pass@host") are rejected, not stripped: a query string is
// not an URL, so anything that carries credentials is not a domain to search.
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

// Accepts "name" or "name.tld" (with or without scheme/www/path), in Unicode;
// the ASCII (punycode) form comes out. Returns { name, tld } using the ASCII
// form, or null when invalid. The TLD must be plain ASCII letters: a punycode
// TLD ("xn--p1ai") is not accepted here, because TLD_LABEL only allows letters.
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
  // "www." is a host prefix, not part of the name being registered. The final
  // dot of a FQDN ("miempresa.com.") means the same domain, so it is dropped
  // too; doing it here, on the normalised host and after the "www." slice,
  // covers inputs that also carry a port, a path or "www.".
  const bare = (host.startsWith('www.') ? host.slice(4) : host).replace(/\.$/, '')

  // No dot: a bare name to look up across the popular TLDs.
  if (!bare.includes('.')) {
    return NAME_LABEL.test(bare) ? { name: bare, tld: '' } : null
  }

  // Split at the first dot that leaves a single-label name on the left and a
  // valid TLD on the right, so two-level suffixes stay whole ("miempresa.com.uy"
  // -> name "miempresa", tld "com.uy" instead of name "miempresa.com", tld
  // "uy"). The name is deliberately restricted to one label: the endpoint
  // registers a name plus a TLD, so "mi.a.com" is not a query it can answer.
  //
  // Known limitation, not fixable here: with three labels the host reads as
  // "name + two-level TLD" ("miempresa.com.uy"), so "blog.miempresa.com" is
  // parsed as name "blog" + tld "miempresa.com" and then answered by the
  // backend with `invalid_tld`, because "miempresa.com" is not in the store's
  // TLD catalogue. Telling a subdomain from a two-level TLD needs the TLD
  // catalogue, which only the backend has; the frontend cannot decide it.
  const parts = bare.split('.')
  for (let i = 1; i < parts.length; i++) {
    const name = parts.slice(0, i).join('.')
    const tld = parts.slice(i).join('.')
    if (NAME_LABEL.test(name) && validTld(tld)) return { name, tld }
  }
  return null
}

// Available alternatives to suggest when the requested domain is taken.
export function availableAlternatives(results, excludeDomain) {
  return (results || []).filter((r) => r && r.available === true && r.domain !== excludeDomain)
}
