// common/primitives/array.mjs v11.301

type ArrayTestPredicate<T, S extends T> = (
	value: T,
	index: number,
	arr: T[]
) => value is S

declare global {
	interface Array<T> {
		/**
		 * Flatten nested arrays by concatenating their contents
		 * @returns - An array containing the concatenated inner values
		 */
		deepFlatten<
			U = T extends Array<infer U> ? ReturnType<U[]['deepFlatten']> : T
		>(): U[]

		/**
		 * Test element-wise equality of the values of this array against the values of another array
		 * @param other - Some other array against which to test equality
		 * @returns Are the two arrays element-wise equal?
		 */
		equals(other: unknown[]): other is this

		/**
		 * Partition an original array into two children array based on a logical test
		 * Elements which test as false go into the first result while elements testing as true appear in the second
		 * @returns An Array of length two whose elements are the partitioned pieces of the original
		 */
		partition<S extends T>(rule: (acc: S[], val: T) => val is S): [T[], S[]]

		/**
		 * Join an Array using a string separator, first filtering out any parts which return a false-y value
		 * @param sep - The separator string
		 * @returns The joined string, filtered of any false values
		 */
		filterJoin(sep: string): string

		/**
		 * Find an element within the Array and remove it from the array
		 * @param find - A function to use as input to findIndex
		 * @param replace - A replacement for the spliced element
		 * @returns The replacement element, the removed element, or null if no element was found.
		 */
		findSplice<S extends T>(
			find: ArrayTestPredicate<T, S>,
			replace: S
		): S | null
		findSplice(find: ArrayTestPredicate<T, T>): T | null
		findSplice<S extends T>(
			find: ArrayTestPredicate<T, S>,
			replace?: T
		): S | T | null
	}
	interface ArrayConstructor {
		/**
		 * Create and initialize an array of length n with integers from 0 to n-1
		 * @memberof Array
		 * @param n - The desired array length
		 * @param min - A desired minimum number from which the created array starts (default: 0)
		 * @returns An array of integers from min to min+n
		 */
		fromRange(n: number, min?: number): number[]
	}
}

export {}
