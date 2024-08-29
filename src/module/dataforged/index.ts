import shajs from 'sha.js'

export * from './rendering'

const HASH_CACHE = {} as Record<string, string>
export function hashLookup(str: string): string {
	HASH_CACHE[str] ||= hash(str)
	return HASH_CACHE[str]
}

export function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}
