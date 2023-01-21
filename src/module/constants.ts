export const RANKS = {
  troublesome: 'IRONSWORN.CHALLENGERANK.Troublesome',
  dangerous: 'IRONSWORN.CHALLENGERANK.Dangerous',
  formidable: 'IRONSWORN.CHALLENGERANK.Formidable',
  extreme: 'IRONSWORN.CHALLENGERANK.Extreme',
  epic: 'IRONSWORN.CHALLENGERANK.Epic',
}

export const RANK_INCREMENTS = {
  troublesome: 12,
  dangerous: 8,
  formidable: 4,
  extreme: 2,
  epic: 1,
}

export enum NumericRank {
  'troublesome' = 1,
  'dangerous' = 2,
  'formidable' = 3,
  'extreme' = 4,
  'epic' = 5,
}

export const NumericRankI18nKeys: { [k in NumericRank]: string } = {
  [NumericRank.troublesome]: 'IRONSWORN.CHALLENGERANK.Troublesome',
  [NumericRank.dangerous]: 'IRONSWORN.CHALLENGERANK.Dangerous',
  [NumericRank.formidable]: 'IRONSWORN.CHALLENGERANK.Formidable',
  [NumericRank.extreme]: 'IRONSWORN.CHALLENGERANK.Extreme',
  [NumericRank.epic]: 'IRONSWORN.CHALLENGERANK.Epic',
}

export const NumericRankIncrements: { [k in NumericRank]: number } = {
  [NumericRank.troublesome]: 12,
  [NumericRank.dangerous]: 8,
  [NumericRank.formidable]: 4,
  [NumericRank.extreme]: 2,
  [NumericRank.epic]: 1,
}
