<template>
	<DropTarget is="div" class="flexcol box" :drop-type="itemType">
		<div v-if="item" class="flexrow" :class="$style.container" style="">
			<document-img :document="item" size="40px" class="nogrow" />

			<h4>{{ item.name }}</h4>

			<div v-if="editMode" class="flexrow" :class="$style.controls">
				<BtnDocDelete
					v-if="foundryitem() != null"
					block
					:document="(foundryitem() as IronswornItem)"
				/>
				<IronBtn block icon="fa:pen-to-square" @click="edit" />
			</div>
		</div>

		<div v-else class="flexcol" :class="$style.emptyContainer">
			<btn-compendium block :compendium="compendiumKey" :text="$t(titleKey)" />
		</div>
	</DropTarget>
</template>

<script setup lang="ts">
import { capitalize, Ref } from 'vue'
import { inject, computed } from 'vue'
import { $ActorKey, ActorKey } from '../../provisions'
import DocumentImg from '../document-img.vue'
import IronBtn from '../buttons/iron-btn.vue'
import BtnCompendium from '../buttons/btn-compendium.vue'
import DropTarget from '../../drop-target.vue'
import BtnDocDelete from '../buttons/btn-doc-delete.vue'
import type { IronswornItem } from '../../../item/item'

const props = defineProps<{
	item: ItemSource<'delve-domain'> | ItemSource<'delve-theme'>
	itemType: string
	titleKey: string
	compendiumKey: string
}>()

const $actor = inject($ActorKey)

const actor = inject(ActorKey) as Ref
const editMode = computed(() => {
	return actor.value.flags['foundry-ironsworn']?.['edit-mode']
})

function foundryitem() {
	return props.item && $actor?.items.get(props.item._id as string)
}

function edit() {
	foundryitem()?.sheet?.render(true)
}
</script>

<style lang="scss" module>
.container {
	position: relative;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.5em;

	h4 {
		margin: 0;
	}
}

.emptyContainer {
	min-height: 54px;
}

.controls {
	position: absolute;
	top: var(--ironsworn-spacer-xs);
	right: var(--ironsworn-spacer-xs);
}
</style>
