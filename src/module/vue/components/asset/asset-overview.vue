<template>
	<AssetCard
		class="flexcol"
		:class="$style.wrapper"
		:show-disabled-abilities="true"
		:readonly-clocks="true"
		:toggle-abilities="true"
		:readonly-fields="false">
		<!--
        Semi-edit view:
        * Text entry for field VALUES (not names)
        * Checkboxes for abilities; clocks not settable to avoid click conflicts
        * Selection for exclusive options
        * Track: name and value only
        * Conditions: checkboxes only
       -->
	</AssetCard>
</template>

<script lang="ts" setup>
import AssetCard from './asset-card.vue'
</script>

<style lang="scss" module>
.wrapper {
	margin: var(--ironsworn-spacer-xl) 0;
	padding: var(--ironsworn-spacer-md);
}
</style>
