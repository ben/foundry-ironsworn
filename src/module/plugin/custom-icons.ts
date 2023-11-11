import { readdirSync } from 'fs'
import path from 'path'

import type { LegacySyncFunction as SassSyncFunction } from 'sass'
import * as Sass from 'sass'
import { assertString } from './sass-assert'
import { map2SassMap } from './sass-convert'

export const ICON_DIRS = [
	path.resolve(process.cwd(), 'system/assets/icons'),
	path.resolve(process.cwd(), 'system/assets/misc')
]

function loadIcons(dirString: string) {
	const filePath = path.resolve(process.cwd(), dirString)
	const files = readdirSync(filePath).filter((file) => file.endsWith('.svg'))
	return files
}

const plugin: Record<string, SassSyncFunction> = {
	// @ts-expect-error
	'getIconVars($dir, $prefix)': (
		dir: Sass.types.String = new Sass.types.String('system/assets/icons'),
		prefix: Sass.types.String = new Sass.types.String('isicon')
	) => {
		assertString(dir as any)
		const dirString = dir.getValue()
		const files = loadIcons(dirString)
		const map = new Map(
			files.map((file) => [
				`--${prefix.getValue()}-${path.basename(file, '.svg')}`,
				file
			])
		)
		return map2SassMap(map, (key, value) => ({
			key: new Sass.types.String(key),
			value: new Sass.types.String(value)
		}))
	},
	// @ts-expect-error
	'getIconClasses($dir, $prefix)': (
		dir: Sass.types.String = new Sass.types.String('system/assets/icons'),
		prefix: Sass.types.String = new Sass.types.String('isicon')
	) => {
		assertString(dir as any)
		const dirString = dir.getValue()
		const files = loadIcons(dirString)
		const map = new Map(
			files.map((file) => [
				`.${prefix.getValue()}-${path.basename(
					file,
					'.svg'
				)}, .${prefix.getValue()}bg-${path.basename(file, '.svg')}`,
				`--${prefix.getValue()}-${path.basename(file, '.svg')}`
			])
		)
		return map2SassMap(map, (key, value) => ({
			key: new Sass.types.String(key),
			value: new Sass.types.String(value)
		}))
	}
}

export default plugin
