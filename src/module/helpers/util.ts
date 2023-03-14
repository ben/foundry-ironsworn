export function capitalize(txt: string) {
	const [first, ...rest] = txt
	return `${first.toUpperCase()}${rest.join('')}`
}
