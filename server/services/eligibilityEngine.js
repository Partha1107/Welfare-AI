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

function qualifyScheme(scheme, profile) {
  const matchingNeeds = scheme.needs.filter((need) => profile.needs?.includes(need))
  if (matchingNeeds.length === 0) return null

  const missingInformation = scheme.requiredFacts
    .filter((fact) => profile[fact] == null || profile[fact] === '')
    .map((fact) => missingFacts[fact])

  const reasons = {
    farming: 'You mentioned farming, so farmer-focused support may be relevant.',
    education: 'You mentioned a child who is studying, so student support may be relevant.',
    healthcare: 'You mentioned medical expenses, so health coverage or state support may be relevant.',
  }

  return {
    ...scheme,
    whyMatch: reasons[matchingNeeds[0]],
    missingInformation,
  }
}

export function matchSchemes(profile) {
  return schemes.map((scheme) => qualifyScheme(scheme, profile)).filter(Boolean)
}

export function findMissingInformation(matches) {
  return [...new Set(matches.flatMap((match) => match.missingInformation))]
}