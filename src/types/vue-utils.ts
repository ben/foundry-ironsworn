import type { ExtractDefaultPropTypes, ExtractPropTypes } from 'vue'

declare global {
	/** Shortcut to get Vue props directly from a component's constructor (rather than nesting a bunch of generics). */
	export type PropsOf<T extends ConstructorOf<{ $props: any }>> =
		ExtractPropTypes<InstanceType<T>['$props']>

	/** Shortcut to get Vue prop defaults directly from a component's constructor (rather than nesting a bunch of generics). */
	export type DefaultPropsOf<T extends ConstructorOf<{ $props: any }>> =
		ExtractDefaultPropTypes<InstanceType<T>['$props']>
}

export {}
