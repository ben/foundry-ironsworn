import type {
	BorderRadiusProperty,
	MaskProperty,
	PaddingProperty
} from 'csstype'
import type { FontAwesomeIconProps } from './module/vue/components/icon/icon-common'
import { FontAwesome } from './module/vue/components/icon/icon-common'

const circlePip: Pip = {
	checked: {
		name: 'circle',
		family: FontAwesome.Family.Solid
	},
	unchecked: {
		name: 'circle',
		family: FontAwesome.Family.Regular
	}
}

const hexPip: Pip = {
	checked: {
		name: 'hexagon',
		rotate: FontAwesome.Rotate['90deg'],
		family: FontAwesome.Family.Solid
	},
	unchecked: {
		name: 'hexagon',
		rotate: FontAwesome.Rotate['90deg'],
		family: FontAwesome.Family.Regular
	}
}

const radioCheck: Checkbox = {
	transition: 'fade',
	checked: { name: 'dot-circle', family: FontAwesome.Family.Regular },
	unchecked: { name: 'circle', family: FontAwesome.Family.Regular }
}

export const DECORATION: Record<string, Theme> = {
	'ironsworn-classic': {
		labelKey: 'IRONSWORN.Settings.ThemeDecorationStyle.IronswornClassic',
		asset: {
			ability: {
				transition: 'fade',
				...circlePip
			}
		},
		impact: radioCheck,
		challengeRank: {
			padding: '1px',
			...circlePip
		}
	},
	starforged: {
		labelKey: 'IRONSWORN.Settings.ThemeDecorationStyle.Starforged',
		asset: {
			ability: {
				transition: 'fade',
				...hexPip
			}
		},
		impact: radioCheck,
		challengeRank: {
			// padding omitted because the hexagon shape doesn't need it
			padding: '0px',
			...hexPip
		}
	}
} as const

interface Theme {
	labelKey: string
	asset: Asset
	impact: Checkbox
	challengeRank: ChallengeRankPips
}

interface Asset {
	header?: Image
	ability: Checkbox
}

interface Pip {
	checked: FontAwesomeIconProps
	unchecked: FontAwesomeIconProps
}

interface ChallengeRankPips extends Pip {
	padding: PaddingProperty<any>
}

interface Image {
	use: string
}

interface Checkbox extends Pip {
	transition: string
}

interface Box {
	mask?: MaskProperty<any>
	borderRadius?: BorderRadiusProperty<any>
}
