// common/primitives/regexp.mjs v11.301

declare module 'RegExp' {
	/**
	 * Escape a given input string, prefacing special characters with backslashes for use in a regular expression
	 * @param  string     The un-escaped input string
	 * @returns           The escaped string, suitable for use in regular expression
	 */
	export function escape(string: string): string
}
