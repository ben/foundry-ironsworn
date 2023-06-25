import type { ExtractDefaultPropTypes, ExtractPropTypes } from 'vue'

declare global {
	type Mutable<T> = T extends Readonly<infer U>
		? U
		: { -readonly [P in keyof T]: T[P] }

	/** Shortcut to get Vue props directly from a component's constructor (rather than nesting a bunch of generics). */
	export type PropsOf<T extends ConstructorOf<{ $props: any }>> = Mutable<
		ExtractPropTypes<InstanceType<T>['$props']>
	>

	/** Shortcut to get Vue prop defaults directly from a component's constructor (rather than nesting a bunch of generics). */
	export type DefaultPropsOf<T extends ConstructorOf<{ $props: any }>> =
		ExtractDefaultPropTypes<InstanceType<T>['$props']>
}

export {}
