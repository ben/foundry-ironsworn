<template>
	<div class="flexrow">
		<div class="flexcol">
			<section class="sheet-area flexcol">
				<!-- Bonds -->
				<Bonds :compact-progress="true" data-tourid="bonds" />

				<hr class="nogrow" />
				<!-- Assets -->
				<PlayerAssets data-tourid="assets">
					<template #start>
						<h4 class="nogrow" :class="$style.h4">
							{{ $t('IRONSWORN.ITEMS.TypeAsset') }}
						</h4>
					</template>
				</PlayerAssets>
			</section>
		</div>
		<ActiveCompletedProgresses
			:compact-progress="true"
			:class="$style.progress"
			data-tourid="progress" />
	</div>
</template>
<script lang="ts" setup>
import Bonds from 'component:bonds.vue'
import ActiveCompletedProgresses from 'component:active-completed-progresses.vue'
import PlayerAssets from '../asset/player-assets.vue'
</script>
<style lang="scss" module>
.progress {
	margin-top: var(--ironsworn-spacer-md);
}

.h4 {
	text-transform: uppercase;
}

.h3 {
	transition: background-color 0.2s ease;
	margin: var(--ironsworn-spacer-md) 0;

	i {
		width: 15px;
		text-align: center;
	}
}
</style>
