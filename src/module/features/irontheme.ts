import type {
	BorderRadiusProperty,
	MaskProperty,
	PaddingProperty
} from 'csstype'
import type { FontAwesomeIconProps } from '../vue/components/icon/icon-common'
import { FontAwesome } from '../vue/components/icon/icon-common'

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

export const THEMES: Record<string, Theme> = {
	ironsworn: {
		labelKey: 'IRONSWORN.Settings.Theme.Ironsworn',
		decoration: {
			tabs: { transition: 'fade' },
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
		}
	},
	starforged: {
		labelKey: 'IRONSWORN.Settings.Theme.Starforged',
		decoration: {
			tabs: { transition: 'slide' },
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
	}
} as const

interface Theme {
	labelKey: string
	/** NYI */
	typography?: Typography
	decoration?: Decoration
}

interface Decoration {
	tabs: Tabs
	asset: Asset
	impact: Checkbox
	challengeRank: ChallengeRankPips
}

interface Typeface extends FontFaceDescriptors {}

interface Typography {
	/**
	 * "Display type" refers to big, eye-catching headings. It's used sparingly, and usually at large sizes, so it's more "fault tolerant" where legibility is concerned; it's a great place to use fonts that are evocative, dramatic, or just plain weird.
	 *
	 * Falls back to `header` options.
	 */
	display?: Typeface
	/**
	 * Options used for most headings as well as labels on important elements.
	 */
	header: Typeface
	/**
	 * Options used for standard body text.
	 */
	body: Typeface
	/**
	 * Options used for text that's rendered for compact display, like footnotes and chat messages.
	 *
	 * Falls back to `body` options.
	 */
	compact?: Typeface
}

interface Tabs {
	transition: string
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
