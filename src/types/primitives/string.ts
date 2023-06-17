// from common/primitives/string.mjs v11.301
declare global {
	interface String {
		/**
		 * Capitalize a string, transforming it's first character to a capital letter.
		 */
		capitalize(): string
		/**
		 * Convert a string to Title Case where the first letter of each word is capitalized.
		 */
		titleCase(): string
		/**
		 * Strip any script tags which were included within a provided string.
		 */
		stripScripts(): string
		/**
		 * Transform any string into an url-viable slug string
		 * @param options      Optional arguments which customize how the slugify operation is performed
		 * @param replacement  The replacement character to separate terms, default is '-'
		 * @param strict    Replace all non-alphanumeric characters, or allow them? Default false
		 * @returns               The slugified input string
		 */
		slugify(options?: { replacement?: string; strict?: boolean }): string
	}
}

export {}
