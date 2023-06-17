// common/primitives/url.mjs v11.301

declare global {
	interface URL {
		/**
		 * Attempt to parse a URL without throwing an error.
		 * @param  url  The string to parse.
		 * @returns  The parsed URL if successful, otherwise null.
		 */
		parseSafe(url: string): URL | null
	}
}

export {}
