// Single source of truth for the hosting plan numbers and the order links.
//
// Prices are per billing period, in USD, and they are NOT translated text: they
// live here and are never duplicated into src/i18n. A price of 0 means "not
// published yet" (the product owner has not set it), not "free" — src/utils/pricing.js
// turns that into the "price to be confirmed" copy instead of rendering $0,
// because the plan button leads to a real order flow.
export const HOSTING_PLANS = [
  { id: 'starter', priceMonthly: 0, priceAnnual: 0, orderUrl: '' },
  { id: 'business', priceMonthly: 0, priceAnnual: 0, orderUrl: '' },
  { id: 'pro', priceMonthly: 0, priceAnnual: 0, orderUrl: '' },
]

// Plan names (Starter / Business / Pro) are proper names of the product line, so
// they are not translated either; the page reads them from
// `t.hosting.plans.items[id].name`, where es and en hold the same string.
export function getPlan(id) {
  return HOSTING_PLANS.find((plan) => plan.id === id) ?? null
}
