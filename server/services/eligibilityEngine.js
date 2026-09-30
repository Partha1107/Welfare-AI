import schemes from '../data/schemes.json' with { type: 'json' }

const missingFacts = {
  farmlandOwnership: 'Whether you own or lease agricultural land',
  cropDetails: 'Your crop and current growing season',
  district: 'Your district, to check local scheme availability',
  studentEducationLevel: 'Your child’s current class or education level',
  studentCategory: 'Any scholarship category or criteria that may apply (optional to share here)',
  householdHealthEligibility: 'Whether your household appears on the applicable health-coverage list',
  treatmentDetails: 'The treatment or medical support needed',
}

const defaultRequiredFacts = {
  farming: ['farmlandOwnership', 'district'],
  education: ['studentEducationLevel', 'studentCategory'],
  healthcare: ['householdHealthEligibility', 'treatmentDetails'],
  family: ['householdHealthEligibility'],
}

function inferSchemeNeeds(scheme) {
  const text = `${scheme.id || ''} ${scheme.name || ''} ${scheme.description || ''} ${scheme.summary || ''}`.toLowerCase()

  if (/(farmer|kisan|agriculture|cultivat|crop|landholding|farm)/.test(text)) return ['farming']
  if (/(student|school|education|scholarship|apprentice|youth|skill)/.test(text)) return ['education']
  if (/(health|medical|hospital|insurance|disability|old age|widow|pension|bereaved|benefit|housing|lpg|jan dhan|loan|vendor|business|entrepreneur|employment|worker)/.test(text)) {
    return /health|medical|hospital|insurance|disability/.test(text) ? ['healthcare'] : ['family']
  }
  return ['family']
}

function inferSchemeRequiredFacts(scheme, need = 'family') {
  if (Array.isArray(scheme.requiredFacts) && scheme.requiredFacts.length) return scheme.requiredFacts
  if (Array.isArray(scheme.needs) && scheme.needs.length) return scheme.needs.map((item) => ({ farming: 'farmlandOwnership', education: 'studentEducationLevel', healthcare: 'householdHealthEligibility', family: 'householdHealthEligibility' }[item] || 'householdHealthEligibility'))
  return defaultRequiredFacts[need] || defaultRequiredFacts.family
}

function inferSchemeCategory(scheme, need = 'family') {
  if (scheme.category) return scheme.category
  return need
}

function normalizeScheme(scheme) {
  const inferredNeed = inferSchemeNeeds(scheme)[0]
  const requiredFacts = inferSchemeRequiredFacts(scheme, inferredNeed)

  return {
    ...scheme,
    id: scheme.id || 'scheme',
    name: scheme.name || scheme.id || 'Government support scheme',
    summary: scheme.summary || scheme.description || 'Potential public assistance based on the available information.',
    category: inferSchemeCategory(scheme, inferredNeed),
    needs: Array.isArray(scheme.needs) ? scheme.needs : inferSchemeNeeds(scheme),
    requiredFacts,
    documents: Array.isArray(scheme.documents) ? scheme.documents : ['identity documents', 'income or household details', 'relevant local records'],
    nextAction: scheme.nextAction || 'Check the latest eligibility details with a local CSC or the relevant public service office.',
  }
}

function qualifyScheme(scheme, profile) {
  const normalizedScheme = normalizeScheme(scheme)
  const matchingNeeds = (normalizedScheme.needs || []).filter((need) => profile.needs?.includes(need))
  if (matchingNeeds.length === 0) return null

  const missingInformation = (normalizedScheme.requiredFacts || [])
    .filter((fact) => profile[fact] == null || profile[fact] === '')
    .map((fact) => missingFacts[fact] || fact)

  const reasons = {
    farming: 'You mentioned farming, so farmer-focused support may be relevant.',
    education: 'You mentioned a child who is studying, so student support may be relevant.',
    healthcare: 'You mentioned medical expenses, so health coverage or state support may be relevant.',
    family: 'You mentioned a household need, so general welfare support may be relevant.',
  }

  return {
    ...normalizedScheme,
    whyMatch: reasons[matchingNeeds[0]] || 'This support may be relevant to your situation.',
    missingInformation,
  }
}

export function matchSchemes(profile) {
  return schemes.map((scheme) => qualifyScheme(scheme, profile)).filter(Boolean)
}

export function findMissingInformation(matches) {
  return [...new Set((matches || []).flatMap((match) => match.missingInformation || []))]
}