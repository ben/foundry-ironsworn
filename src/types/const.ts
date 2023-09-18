declare module '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs' {
	/**
	 * The configured showdown bi-directional HTML <-> Markdown converter options.
	 * @default ```{
	 * disableForced4SpacesIndentedSublists: true,
	 * noHeaderId: true,
	 * parseImgDimensions: true,
	 * strikethrough: true,
	 * tables: true,
	 * tablesHeaderId: true
	 * }```
	 */
	export const SHOWDOWN_OPTIONS: showdown.ShowdownOptions
}

export {}
