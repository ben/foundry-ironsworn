export const RANKS = {
  troublesome: 'IRONSWORN.Troublesome',
  dangerous: 'IRONSWORN.Dangerous',
  formidable: 'IRONSWORN.Formidable',
  extreme: 'IRONSWORN.Extreme',
  epic: 'IRONSWORN.Epic',
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

export const NumericRankI18nKeys: { [k: NumericRank]: string } = {
  [NumericRank.troublesome]: 'IRONSWORN.Troublesome',
  [NumericRank.dangerous]: 'IRONSWORN.Dangerous',
  [NumericRank.formidable]: 'IRONSWORN.Formidable',
  [NumericRank.extreme]: 'IRONSWORN.Extreme',
  [NumericRank.epic]: 'IRONSWORN.Epic',
}

export const NumericRankIncrements: { [k: NumericRank]: number } = {
  [NumericRank.troublesome]: 12,
  [NumericRank.dangerous]: 8,
  [NumericRank.formidable]: 4,
  [NumericRank.extreme]: 2,
  [NumericRank.epic]: 1,
}
