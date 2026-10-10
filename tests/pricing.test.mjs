import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BILLING_PERIODS,
  formatUsd,
  getPlanAmount,
  isPlanPricePending,
  isPricePending,
} from '../src/utils/pricing.js'
import { HOSTING_PLANS, getPlan } from '../src/data/hostingPlans.js'

// The real shapes the page has to survive: the published-but-zero plan that
// ships today, and a plan with real figures.
const pendingPlan = { id: 'starter', priceMonthly: 0, priceAnnual: 0, orderUrl: '' }
const pricedPlan = { id: 'business', priceMonthly: 9.99, priceAnnual: 99.9, orderUrl: '' }

test('a plan with 0 in both periods is pending, in either period', () => {
  for (const period of BILLING_PERIODS) {
    assert.equal(getPlanAmount(pendingPlan, period), 0)
    assert.equal(isPlanPricePending(pendingPlan, period), true, `period: ${period}`)
  }
  assert.equal(isPricePending(0), true)
})

test('the toggle picks the amount of the chosen period, monthly by default', () => {
  assert.equal(getPlanAmount(pricedPlan, 'monthly'), 9.99)
  assert.equal(getPlanAmount(pricedPlan, 'annual'), 99.9)
  assert.equal(getPlanAmount(pricedPlan), 9.99)
  // Only 'annual' is annual; anything else falls back to the monthly figure.
  for (const period of ['monthly', 'annual', undefined, null, '', 'MONTHLY', 'yearly', 0, 12, {}]) {
    if (period === 'annual') continue
    assert.equal(getPlanAmount(pricedPlan, period), 9.99, `period: ${JSON.stringify(period)}`)
  }
  // A config with only one of the two figures set is pending in the other period.
  const monthlyOnly = { id: 'pro', priceMonthly: 4.5, priceAnnual: 0 }
  assert.equal(isPlanPricePending(monthlyOnly, 'monthly'), false)
  assert.equal(isPlanPricePending(monthlyOnly, 'annual'), true)
})

test('a published amount is not pending', () => {
  assert.equal(isPlanPricePending(pricedPlan, 'monthly'), false)
  assert.equal(isPlanPricePending(pricedPlan, 'annual'), false)
  assert.equal(isPricePending(0.01), false)
})

test('formatUsd renders a USD amount', () => {
  assert.equal(formatUsd(9.99), '$9.99')
  assert.equal(formatUsd(0), '$0.00')
  assert.equal(formatUsd(1234.5), '$1,234.50')
})

test('boundaries: negative, undefined and unknown plans never throw', () => {
  for (const amount of [-1, -0.01, Number.NEGATIVE_INFINITY, Number.NaN]) {
    assert.equal(isPricePending(amount), true, `amount: ${amount}`)
  }
  for (const amount of [undefined, null, '9.99', {}, [], true]) {
    assert.equal(isPricePending(amount), true, `amount: ${JSON.stringify(amount)}`)
    assert.equal(typeof formatUsd(amount), 'string', `formatUsd threw for ${JSON.stringify(amount)}`)
  }

  for (const plan of [undefined, null, 'starter', 42, true, []]) {
    assert.equal(getPlanAmount(plan, 'monthly'), null, `plan: ${JSON.stringify(plan)}`)
    assert.equal(isPlanPricePending(plan, 'monthly'), true, `plan: ${JSON.stringify(plan)}`)
  }

  // An unknown id is not a plan: no throw, and it reads as pending.
  assert.equal(getPlan('nope'), null)
  assert.equal(isPlanPricePending(getPlan('nope'), 'annual'), true)
})

test('the shipping data has the three plans the page renders, with no invented figures', () => {
  assert.deepEqual(
    HOSTING_PLANS.map((plan) => plan.id),
    ['starter', 'business', 'pro'],
  )
  for (const plan of HOSTING_PLANS) {
    // While the figures are unpublished, every period is 0 (never a made-up
    // number) and the page turns that into the "price pending" copy.
    assert.equal(plan.priceMonthly, 0, `${plan.id}.priceMonthly`)
    assert.equal(plan.priceAnnual, 0, `${plan.id}.priceAnnual`)
    assert.equal(isPlanPricePending(plan, 'monthly'), true, `${plan.id} monthly`)
    assert.equal(isPlanPricePending(plan, 'annual'), true, `${plan.id} annual`)
    // No order URL yet: with '' the button must be the internal contact link.
    assert.equal(plan.orderUrl, '', `${plan.id}.orderUrl`)
  }
  assert.equal(getPlan('business').priceMonthly, 0)
})

test('the plan names are not translated and the feature lists are empty', async () => {
  const { hosting } = await import('../src/i18n/sections/hosting.js')
  for (const lang of ['es', 'en']) {
    const items = hosting[lang].plans.items
    assert.deepEqual(Object.keys(items).sort(), ['business', 'pro', 'starter'], `items in ${lang}`)
    for (const plan of HOSTING_PLANS) {
      // An empty list is the point: the UI shows "details pending" instead of a
      // feature nobody has confirmed.
      assert.deepEqual(items[plan.id].features, [], `${lang}.${plan.id}.features`)
    }
  }
  for (const plan of HOSTING_PLANS) {
    assert.equal(
      hosting.es.plans.items[plan.id].name,
      hosting.en.plans.items[plan.id].name,
      `${plan.id} name differs between languages`,
    )
  }
})
