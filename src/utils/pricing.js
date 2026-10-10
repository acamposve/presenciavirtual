// Pricing rules for the hosting plans, kept out of the component so they can be
// tested with `node --test` (the project has no renderer: no jsdom, no
// testing-library, so logic inside a component is not reachable from a test).
//
// These helpers take a plan object (or its amount), never a plan id, so they
// stay decoupled from src/data/hostingPlans.js and testable on their own.
export const BILLING_PERIODS = ['monthly', 'annual']

// A price of 0 (or any non-positive / missing figure) means the amount has not
// been published yet. It must never render as "$0": the plan button leads to a
// real order flow, so a published zero would read as "free".
export function isPricePending(amount) {
  return typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0
}

// amount of the chosen period for a plan object; anything but 'annual' is monthly.
export function getPlanAmount(plan, period = 'monthly') {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return null
  const amount = period === 'annual' ? plan.priceAnnual : plan.priceMonthly
  // An unknown field (e.g. a plan object missing priceAnnual) is "no amount",
  // not `undefined`: null keeps isPricePending's answer stable for callers.
  return amount === undefined ? null : amount
}

export function isPlanPricePending(plan, period = 'monthly') {
  return isPricePending(getPlanAmount(plan, period))
}

export function formatUsd(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    typeof amount === 'number' && Number.isFinite(amount) ? amount : 0,
  )
}
