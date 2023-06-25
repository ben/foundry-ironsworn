<template>
	<div class="flexcol">
		<!-- HEADER -->
		<SheetHeaderBasic class="nogrow" :document="data.item" />

		<div
			class="flexrow nogrow"
			style="gap: 1em; margin: var(--ironsworn-spacer-lg) 0">
			<RankPips
				class="nogrow"
				:current="data.item.system.track.rank"
				@change="(r) => set('system.track.rank', r)" />
			<h4 style="margin: 0; line-height: 22px">
				{{ $item?.system.track.localizeRank() }}
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
			v-model="data.item.system.track.subtype"
			class="nogrow"
			@change="update('system.track.subtype')">
			<option value="vow">
				{{ $t('IRONSWORN.ITEM.SubtypeVow') }}
			</option>
			<option value="progress">
				{{ $t('IRONSWORN.ITEM.SubtypeProgress') }}
			</option>
			<option value="connection">
				{{ $t('IRONSWORN.ITEM.SubtypeConnection') }}
			</option>
		</select>

		<hr class="nogrow" />

		<div class="nogrow">
			<label class="checkbox">
				<input
					v-model="data.item.system.track.enabled"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Track') }}
			</label>

			<CollapseTransition>
				<div v-if="data.item.system.track?.enabled" class="nogrow">
					<div
						class="flexrow nogrow"
						style="
							justify-content: flex-end;
							margin-bottom: var(--ironsworn-spacer-sm);
						">
						<IronBtn
							v-if="data.item.system.track?.enabled"
							block
							nogrow
							:tooltip="$t('IRONSWORN.UnmarkProgress')"
							icon="fa:caret-left"
							@click="$item?.system.markProgress(-1)" />
						<IronBtn
							v-if="data.item.system.track?.enabled"
							block
							nogrow
							:tooltip="$t('IRONSWORN.MarkProgress')"
							icon="fa:caret-right"
							@click="$item?.system.markProgress(1)" />
					</div>
					<!-- PROGRESS -->
					<div class="flexrow track nogrow" style="margin-bottom: 1em">
						<ProgressTrack
							:ticks="data.item.system.track.ticks"
							:rank="data.item.system.track.rank" />
					</div>
				</div>
			</CollapseTransition>
		</div>

		<hr class="nogrow" />

		<div class="nogrow">
			<label class="checkbox">
				<input
					v-model="data.item.system.clock!.enabled"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Clock') }}
			</label>

			<CollapseTransition>
				<div v-if="data.item.system.clock?.enabled" class="flexrow nogrow">
					<div class="nogrow" style="margin: 0 1rem">
						<Clock
							:wedges="data.item.system.clock.max"
							:ticked="data.item.system.clock.value"
							@click="(v) => set('system.clock.value', v)" />
					</div>
					<div class="flexcol">
						{{ $t('IRONSWORN.Segments') }}:
						<select
							v-model="data.item.system.clock.max"
							class="nogrow"
							style="margin: var(--ironsworn-spacer-lg) 0"
							@change="update('system.clock.max')">
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
		<MceEditor
			v-model="data.item.system.description"
			@save="update('system.description')" />
		<BtnDocDelete
			nogrow
			block
			:class="$style.danger"
			:btn-text="true"
			:document="$item" />
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
const $item = inject($ItemKey) as IronswornItem<'progress'>

provide(
	ItemKey,
	computed(() => props.data.item)
)

function saveChecks() {
	update('system.completed', 'system.track.enabled', 'system.clock.enabled')
}

function set(key, value) {
	$item?.update({ [key]: value })
}

function update(...keys: string[]) {
	const data = {}
	for (const key of keys) {
		const newValue = getProperty(props.data.item, key)
		data[key] = newValue
	}
	$item?.update(data)
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
