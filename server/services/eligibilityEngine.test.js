import test from 'node:test'
import assert from 'node:assert/strict'

import { findMissingInformation, matchSchemes } from './eligibilityEngine.js'

test('farmer profile matches relevant welfare schemes without crashing', () => {
  const profile = {
    age: null,
    location: 'Tamil Nadu',
    district: null,
    occupation: 'Small farmer',
    annualIncome: null,
    children: null,
    farmer: true,
    studentInFamily: false,
    medicalExpenses: false,
    needs: ['farming'],
  }

  const matches = matchSchemes(profile)

  assert.ok(Array.isArray(matches))
  assert.ok(matches.length > 0)
  assert.ok(matches.some((scheme) => scheme.name.toLowerCase().includes('pm-kisan') || scheme.id === 'pm_kisan'))
  assert.ok(Array.isArray(findMissingInformation(matches)))
})
