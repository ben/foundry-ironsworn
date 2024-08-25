<template>
	<div
		ref="$el"
		class="flexcol nogrow movesheet-row"
		:class="{ hidden: node?.forceHidden, highlighted: state.highlighted }"
		data-tooltip-direction="LEFT"
		:data-tourid="`oracle-${node.dataforgedNode?.$id}`"
	>
		<!-- TODO: split this into two components, yo -->
		<!-- Leaf node -->
		<div v-if="isLeaf">
			<h4 class="flexrow">
				<BtnOracle :node="node" :text="node?.displayName">
					<template #icon>
						<IronIcon name="oracle" :size="spacerSize" />
					</template>
				</BtnOracle>
				<IronBtn
					nogrow
					class="show-oracle-info"
					icon="fa:eye"
					@click="toggleDescription()"
				/>
			</h4>
			<CollapseTransition>
				<Suspense v-if="state.descriptionExpanded">
					<OracleExpandedDescription :node="node" />
				</Suspense>
			</CollapseTransition>
		</div>

		<!-- Branch node -->
		<div v-else>
			<h4 class="flexrow">
				<IronBtn :text="node?.displayName" @click="toggleManually()">
					<template #icon>
						<FontIcon
							nogrow
							:class="$style.fontIcon"
							name="caret-right"
							:rotate="
								state.manuallyExpanded ? FontAwesome.Rotate['90deg'] : undefined
							"
						/>
					</template>
				</IronBtn>
			</h4>

			<CollapseTransition>
				<div
					v-show="state.manuallyExpanded"
					class="flexcol"
					:class="$style.indent"
				>
					<oracle-tree-node
						v-for="child in node?.children"
						:key="child.displayName"
						ref="children"
						:node="child"
						@navigated="childNavigated"
					/>
				</div>
			</CollapseTransition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { IOracleTreeNode } from '../../features/customoracles'

import { FontAwesome } from './icon/icon-common'
import BtnOracle from './buttons/btn-oracle.vue'
import CollapseTransition from './transition/collapse-transition.vue'
import IronBtn from './buttons/iron-btn.vue'
import FontIcon from './icon/font-icon.vue'
import IronIcon from './icon/iron-icon.vue'
import OracleExpandedDescription from './oracle-expanded-description.vue'

const props = defineProps<{ node: IOracleTreeNode }>()

const state = reactive({
	manuallyExpanded: props.node.forceExpanded ?? false,
	descriptionExpanded: false,
	highlighted: false
})

const spacerSize = '18px'

const isLeaf = computed(() => {
	return props.node.tables.length > 0
})

async function toggleDescription() {
	state.descriptionExpanded = !state.descriptionExpanded
}
function toggleManually() {
	state.manuallyExpanded = !state.manuallyExpanded
}

const children = ref([] as any[])

function collapse() {
	state.manuallyExpanded = false
	state.descriptionExpanded = false
	for (const child of children.value ?? []) {
		child.collapse()
	}
}
function expand() {
	state.manuallyExpanded = true
}

const $el = ref<HTMLElement>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', (dsid) => {
	if (props.node.dataswornNode?._id === dsid) {
		state.manuallyExpanded = true
		state.highlighted = true
		$el.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
		setTimeout(() => {
			state.highlighted = false
		}, 2000)

		// If this is a leaf, make sure the parent is expanded
		if (isLeaf.value) {
			$emit('navigated')
		}
	}
})

function childNavigated() {
	state.manuallyExpanded = true
}

defineExpose({
	dfid: () => props.node.dataforgedNode?.$id,
	dsid: () => props.node.dataswornNode?._id,
	dsIdentifier: () => props.node.dsIdentifier,
	expand,
	collapse
})

const $emit = defineEmits({
	navigated: null
})
</script>

<style lang="scss" module>
.content {
	margin: var(--ironsworn-spacer-sm);
}

.indent {
	margin-left: v-bind(spacerSize);
}

.fontIcon {
	font-size: v-bind(spacerSize);
	height: v-bind(spacerSize);
	width: v-bind(spacerSize);
}
</style>

<style lang="scss" scoped>
.show-oracle-info {
	// padding: 4px;
}

.movesheet-row {
	transition: all 0.4s ease;
}

h4 {
	margin: 0;
	height: min-content;
	line-height: 1;

	button {
		height: min-content;
		text-transform: uppercase;
		line-height: 1;
	}
}

.hidden {
	display: none;
}
</style>
