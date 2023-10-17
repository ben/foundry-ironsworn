declare module '@foundryvtt/foundryvtt-cli' {
	/* -------------------------------------------- */
	/*  Configuration                               */
	/* -------------------------------------------- */

	export type DocumentType =
		| 'Actor'
		| 'Adventure'
		| 'Cards'
		| 'ChatMessage'
		| 'Combat'
		| 'FogExploration'
		| 'Folder'
		| 'Item'
		| 'JournalEntry'
		| 'Macro'
		| 'Playlist'
		| 'RollTable'
		| 'Scene'
		| 'Setting'
		| 'User'

	export type DocumentCollection =
		| 'actors'
		| 'adventures'
		| 'cards'
		| 'messages'
		| 'combats'
		| 'fog'
		| 'folders'
		| 'items'
		| 'journal'
		| 'macros'
		| 'playlists'
		| 'tables'
		| 'scenes'
		| 'settings'
		| 'users'

	export interface PackageOptions {
		/**
		 * Whether to operate on a NeDB database, otherwise a LevelDB database is assumed.
		 * @default false
		 */
		nedb?: boolean
		/**
		 * Whether the source files are in YAML format, otherwise JSON is assumed.
		 * @default false
		 */
		yaml?: boolean
		/**
		 * Whether to log operation progress to the console.
		 * @default false
		 */
		log?: boolean

		/** A function that is called on every entry to transform it. */
		transformEntry?: EntryTransformer
	}

	export interface CompileOptions extends PackageOptions {
		/** Whether to recurse into child directories to locate source files, otherwise only source files located in the root directory will be used. */
		recursive?: boolean
	}

	interface ExtractOptions extends PackageOptions {
		/**
		 * A function that is used to generate a filename for the extracted Document. If used, the generated name must include the appropriate file extension. The generated name will be resolved against the root path provided to the operation, and the entry will be written to that resolved location.
		 */
		transformName?: NameTransformer
	}

	export type ExtractOptionsNeDB =
		| (ExtractOptions & {
				/** Required only for NeDB packs in order to generate a correct key. */
				documentType: DocumentType
		  })
		| (ExtractOptions & {
				/** Required only for NeDB packs in order to generate a correct key. Can be used instead of documentType if known. */
				collection: DocumentCollection
		  })

	export interface ExtractOptionsLevelDB extends ExtractOptions {}

	/**
	 * @param entry - The entry data.
	 * @return Return boolean false to indicate that this entry should be discarded.
	 */
	export type EntryTransformer = (entry: object) => Promise<false | void>

	/**
	 * @param entry - The entry data.
	 * @return If a string is returned, it is used as the filename that the entry will be written to.
	 */
	export type NameTransformer = (entry: object) => Promise<string | void>

	/**
	 * @param doc - The Document being operated on.
	 * @param collection - The Document's collection.
	 * @param options - Additional options supplied by the invocation on the level above this one.
	 * @returns {Promise<object|void>}  Options to supply to the next level of the hierarchy.
	 */
	export type HierarchyApplyCallback = (
		doc: object,
		collection: string,
		options?: object
	) => Promise<object | void>

	/**
	 * @callback HierarchyMapCallback
	 * @param {any} entry          The element stored in the collection.
	 * @param {string} collection  The collection name.
	 * @returns {Promise<any>}
	 */
	export type HierarchyMapCallback = (
		entry: any,
		collection: string
	) => Promise<object | void>

	// HIERARCHY
	// TYPE_COLLECTION_MAP

	/* -------------------------------------------- */
	/*  Compiling                                   */
	/* -------------------------------------------- */

	/**
	 * Compile source files into a compendium pack.
	 * @param src - The directory containing the source files.
	 * @param dest - The target compendium pack. This should be a directory for LevelDB packs, or a .db file for NeDB packs.
	 */
	export function compilePack(
		src: string,
		dest: string,
		options?: CompileOptions
	): Promise<void>

	// compileNedb
	// compileClassicLevel
	// compactClassicLevel

	/* -------------------------------------------- */
	/*  Extracting                                  */
	/* -------------------------------------------- */

	/**
	 * Extract the contents of a compendium pack into individual source files for each primary Document.
	 * @param src - The source compendium pack. This should be a directory for LevelDB pack, or a .db file for NeDB packs.
	 * @param dest - The directory to write the extracted files into.
	 * @param options
	 */
	export function extractPack(
		src: string,
		dest: string,
		options?: ExtractOptions
	): Promise<void>

	// extractNedb
	// extractClassicLevel

	/* -------------------------------------------- */
	/*  Utilities                                   */
	/* -------------------------------------------- */

	// applyHierarchy
	// mapHierarchy
	// findSourceFiles
	// keyJoin
	// getSafeFilename
}
