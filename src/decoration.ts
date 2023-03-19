import { BorderRadiusProperty, MaskProperty } from 'csstype'
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
	Ironsworn: {
		asset: {
			ability: {
				transition: 'fade',
				...circlePip
			}
		},
		impact: radioCheck,
		challengeRank: circlePip
	},
	Starforged: {
		asset: {
			ability: {
				transition: 'fade',
				...hexPip
			}
		},
		impact: radioCheck,
		challengeRank: hexPip
	}
}

interface Theme {
	asset: Asset
	impact: Checkbox
	challengeRank: Pip
}

interface Asset {
	header?: Image
	ability: Checkbox
}

interface Pip {
	checked: FontAwesomeIconProps
	unchecked: FontAwesomeIconProps
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
