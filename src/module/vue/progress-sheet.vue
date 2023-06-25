<template>
	<div class="flexcol">
		<!-- HEADER -->
		<SheetHeaderBasic class="nogrow" :document="data.item" />

		<div
			class="flexrow nogrow"
			style="gap: 1em; margin: var(--ironsworn-spacer-lg) 0">
			<RankPips
				class="nogrow"
				:current="data.item.system.rank"
				@change="setRank" />
			<h4 style="margin: 0; line-height: 22px">
				{{ $item?.system.localizeRank() }}
			</h4>
			<label class="checkbox nogrow">
				<input
					v-model="data.item.system.completed"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Completed') }}
			</label>
		</div>

		<select
			v-model="data.item.system.subtype"
			class="nogrow"
			@change="subtypeChange">
			<option value="vow">
				{{ $t('IRONSWORN.ITEM.SubtypeVow') }}
			</option>
			<option value="progress">
				{{ $t('IRONSWORN.ITEM.SubtypeProgress') }}
			</option>
			<option value="bond">
				{{ $t('IRONSWORN.ITEM.SubtypeConnection') }}
			</option>
		</select>

		<hr class="nogrow" />

		<div class="nogrow">
			<label class="checkbox">
				<input
					v-model="data.item.system.hasTrack"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Track') }}
			</label>

			<CollapseTransition>
				<div v-if="data.item.system.hasTrack" class="nogrow">
					<div
						class="flexrow nogrow"
						style="
							justify-content: flex-end;
							margin-bottom: var(--ironsworn-spacer-sm);
						">
						<IronBtn
							v-if="data.item.system.hasTrack"
							block
							nogrow
							:tooltip="$t('IRONSWORN.UnmarkProgress')"
							icon="fa:caret-left"
							@click="$item?.system.markProgress(-1)" />
						<IronBtn
							v-if="data.item.system.hasTrack"
							block
							nogrow
							:tooltip="$t('IRONSWORN.MarkProgress')"
							icon="fa:caret-right"
							@click="$item?.system.markProgress(1)" />
					</div>
					<!-- PROGRESS -->
					<div class="flexrow track nogrow" style="margin-bottom: 1em">
						<ProgressTrack
							:ticks="data.item.system.current"
							:rank="data.item.system.rank" />
					</div>
				</div>
			</CollapseTransition>
		</div>

		<hr class="nogrow" />

		<div class="nogrow">
			<label class="checkbox">
				<input
					v-model="data.item.system.hasClock"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Clock') }}
			</label>

			<CollapseTransition>
				<div v-if="data.item.system.hasClock" class="flexrow nogrow">
					<div class="nogrow" style="margin: 0 1rem">
						<Clock
							:wedges="data.item.system.clockMax"
							:ticked="data.item.system.clockTicks"
							@click="setClock" />
					</div>
					<div class="flexcol">
						{{ $t('IRONSWORN.Segments') }}:
						<select
							v-model="data.item.system.clockMax"
							class="nogrow"
							style="margin: var(--ironsworn-spacer-lg) 0"
							@change="clockMaxChange">
							<option
								v-for="clockSize in [4, 6, 8, 10, 12]"
								:key="clockSize"
								:value="clockSize">
								{{ clockSize }}
							</option>
						</select>
					</div>
				</div>
			</CollapseTransition>
		</div>

		<hr class="nogrow" />
		<!-- DESCRIPTION -->
		<MceEditor v-model="data.item.system.description" @save="saveDescription" />
		<BtnDocDelete
			nogrow
			block
			:class="$style.danger"
			:btn-text="true"
			:document="($item as any)" />
	</div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { $ItemKey, ItemKey } from './provisions'
import RankPips from './components/progress/rank-pips.vue'
import Clock from './components/clock.vue'
import MceEditor from './components/mce-editor.vue'
import SheetHeaderBasic from './sheet-header-basic.vue'
import ProgressTrack from './components/progress/progress-track.vue'
import CollapseTransition from './components/transition/collapse-transition.vue'
import IronBtn from './components/buttons/iron-btn.vue'
import type { IronswornItem } from '../item/item'
import BtnDocDelete from './components/buttons/btn-doc-delete.vue'

const props = defineProps<{ data: { item: ItemSource<'progress'> } }>()
const $item = inject<IronswornItem<'progress'>>($ItemKey)

provide(
	ItemKey,
	computed(() => props.data.item)
)

function setRank(rank) {
	$item?.update({ system: { rank } })
}

function subtypeChange() {
	$item?.update({ system: { subtype: props.data.item.system.subtype } })
}

function clockMaxChange() {
	$item?.update({
		system: { clockMax: props.data.item.system.clockMax }
	})
}

function saveChecks() {
	$item?.update({
		system: {
			completed: props.data.item.system.completed,
			hasTrack: props.data.item.system.hasTrack,
			hasClock: props.data.item.system.hasClock
		}
	})
}

function setClock(num) {
	$item?.update({ system: { clockTicks: num } })
}

function saveDescription() {
	$item?.update({ system: { description: props.data.item.system.description } })
}
</script>

<style lang="scss" module>
.danger {
	--ironsworn-color-clickable-block-border: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-fg: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-bg: transparent;
	--ironsworn-color-clickable-block-border-hover: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-fg-hover: var(--ironsworn-color-light);
	--ironsworn-color-clickable-block-bg-hover: var(--ironsworn-color-danger);

	margin: var(--ironsworn-spacer-md) 0 0;
	border-width: var(--ironsworn-border-width-lg);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-lg);
	color: var(--ironsworn-color-danger);
}
</style>
