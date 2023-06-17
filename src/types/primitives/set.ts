// common/primitives/set.mjs v11.301

type SetTestPredicate<T, S extends T> = (
	value: T,
	index: number,
	set: Set<T>
) => value is S

declare global {
	interface Set<T> {
		/**
		 * Return the difference of two sets.
		 * @param {Set} other       Some other set to compare against
		 * @returns {Set}           The difference defined as objects in this which are not present in other
		 */
		difference<U>(other: Set<U>): this

		/**
		 * Return the symmetric difference of two sets.
		 * @param {Set} other  Another set.
		 * @returns {Set}      The set of elements that exist in this or other, but not both.
		 */
		symmetricDifference<U>(other: Set<U>): Set<U | T>

		/**
		 * Test whether this set is equal to some other set.
		 * Sets are equal if they share the same members, independent of order
		 * @param {Set} other       Some other set to compare against
		 * @returns {boolean}       Are the sets equal?
		 */
		equals<U>(other: Set<U>): boolean

		/**
		 * Return the first value from the set.
		 * @returns {*}             The first element in the set, or undefined
		 */
		first(): T | undefined

		/**
		 * Return the intersection of two sets.
		 * @param {Set} other       Some other set to compare against
		 * @returns {Set}           The intersection of both sets
		 */
		intersection<U>(other: Set<U>): Set<T & U>

		/**
		 * Test whether this set has an intersection with another set.
		 * @param {Set} other       Another set to compare against
		 * @returns {boolean}       Do the sets intersect?
		 */
		intersects<U>(other: Set<U>): boolean

		/**
		 * Return the union of two sets.
		 * @param {Set} other  The other set.
		 * @returns {Set}
		 */
		union<U>(other: Set<U>): Set<U | T>

		/**
		 * Test whether this set is a subset of some other set.
		 * A set is a subset if all its members are also present in the other set.
		 * @param {Set} other       Some other set that may be a subset of this one
		 * @returns {boolean}       Is the other set a subset of this one?
		 */
		isSubset<U>(other: Set<U>): boolean

		/**
		 * Convert a set to a JSON object by mapping its contents to an array
		 * @returns The set elements as an array.
		 */
		toObject(): T[]

		/**
		 * Test whether every element in this Set satisfies a certain test criterion.
		 * @see Array#every
		 * @param {function(*,number,Set): boolean} test   The test criterion to apply. Positional arguments are the value,
		 * the index of iteration, and the set being tested.
		 * @returns {boolean}  Does every element in the set satisfy the test criterion?
		 */
		every(test: (item: T, index: number, set: this) => boolean): boolean

		/**
		 * Filter this set to create a subset of elements which satisfy a certain test criterion.
		 * @see Array#filter
		 * @param test - The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being filtered.
		 * @returns A new Set containing only elements which satisfy the test criterion.
		 */
		filter<S extends T>(test: SetTestPredicate<T, S>): Set<S>

		/**
		 * Find the first element in this set which satisfies a certain test criterion.
		 * @see Array#find
		 * @param test - The test criterion to apply. Positional arguments are the value,
		 * the index of iteration, and the set being searched.
		 * @returns The first element in the set which satisfies the test criterion, or undefined.
		 */
		find<S extends T>(test: SetTestPredicate<T, S>): S | undefined

		/**
		 * Create a new Set where every element is modified by a provided transformation function.
		 * @see Array#map
		 * @param  transform  The transformation function to apply.Positional arguments are
		 * the value, the index of iteration, and the set being transformed.
		 * @returns A new Set of equal size containing transformed elements.
		 */
		map<U>(
			transform: (value: T, index: number, set: Set<T>) => U,
			thisArg?: any
		): Set<U>

		/**
		 * Create a new Set with elements that are filtered and transformed by a provided reducer function.
		 * @see Array#reduce
		 * @param reducer  A reducer function applied to each value. Positional arguments are the accumulator, the value, the index of iteration, and the set being reduced.
		 * @param accumulator The initial value of the returned accumulator.
		 * @returns The final value of the accumulator.
		 */
		reduce(
			reducer: (
				previousValue: T,
				currentValue: T,
				currentIndex: number,
				set: Set<T>
			) => T
		): T
		reduce(
			reducer: (
				previousValue: T,
				currentValue: T,
				currentIndex: number,
				set: Set<T>
			) => T,
			accumulator: T
		): T

		/**
		 * Test whether any element in this Set satisfies a certain test criterion.
		 * @see Array#some
		 * @param test The test criterion to apply. Positional arguments are the value, the index of iteration, and the set being tested.
		 * @returns Does any element in the set satisfy the test criterion?
		 */
		some(
			test: (value: T, index: number, array: Set<T>) => unknown,
			thisArg?: any
		): boolean
	}
}

export {}
