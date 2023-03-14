<template>
	<header class="sheet-header">
		<slot></slot>
	</header>
</template>
<script lang="ts" setup>
/**
 * Wrapper to standardize + encapsulate sheet header styles.
 */
</script>
<style lang="less">
// not scoped, so it also applies to handlebars templates with the appropriate class
.sheet-header {
	--ironsworn-title-height: 50px;

	display: flex;
	flex-direction: row;
	gap: var(--ironsworn-spacer-md);

	.profile-img {
		flex: 0 0 var(--ironsworn-title-height);
		margin-right: var(--ironsworn-spacer-xl);
		height: var(--ironsworn-title-height);
	}

	.header-fields {
		flex: 1;
		height: calc(var(--ironsworn-title-height) * 2);
	}

	h1.charname {
		flex-grow: 1;
		margin: 0;
		border-bottom: 0;
		padding: 0;
		height: var(--ironsworn-title-height);

		input {
			margin: 0;
			width: 100%;
			height: 100%;
		}
	}
}
</style>
