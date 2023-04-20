<template>
	<div class="move-sheet flexcol" style="gap: 5px">
		<SheetHeaderBasic class="nogrow" :document="data.item"> </SheetHeaderBasic>

		<div class="flexrow">
			<!-- Tab selection on left -->
			<div class="flexcol nogrow" style="max-width: 33%; white-space: nowrap">
				<!-- These are always here -->
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="FullText"
					property="Text"
					@click="switchContent" />
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Trigger"
					property="Trigger.Text"
					@click="switchContent" />

				<!-- Actions -->
				<hr class="nogrow" />
				<h4 class="flexrow nogrow">
					<span class="flexrow">Actions</span>
					<IronBtn block icon="fa:plus" @click="addTrigger" />
				</h4>
				<sfmove-tab
					v-for="option in triggerOptions"
					:key="option.key"
					:current-property="state.currentProperty"
					:title="option.title"
					:property="option.property"
					@click="switchContent($event, option.actionPropKey)"
					@delete="removeTrigger(option)" />

				<!-- Outcomes -->
				<hr class="nogrow" />
				<h4 class="nogrow">Outcomes</h4>
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Strong_hit"
					property="Outcomes.Strong Hit.Text"
					@click="switchContent" />
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Strong_hit_match"
					property="Outcomes.Strong Hit.With a Match.Text"
					@click="switchContent" />
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Weak_hit"
					property="Outcomes.Weak Hit.Text"
					@click="switchContent" />
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Miss"
					property="Outcomes.Miss.Text"
					@click="switchContent" />
				<sfmove-tab
					:current-property="state.currentProperty"
					title-key="Miss_match"
					property="Outcomes.Miss.With a Match.Text"
					@click="switchContent" />
			</div>

			<!-- Editor on right -->
			<div class="flexcol">
				<div v-if="state.currentRollType" class="flexcol nogrow">
					<div class="flexrow">
						<div class="flexcol">
							<label
								v-for="x in ['Action roll', 'Progress roll']"
								:key="x"
								class="nogrow">
								<input
									v-model="state.currentRollType"
									type="radio"
									name="actiontype"
									:value="x"
									@change="saveActionProps" />
								{{ x.split(' ')[0] }}
							</label>
						</div>
						<div class="flexcol">
							<label
								v-for="x in ['Any', 'Highest', 'Lowest', 'All']"
								:key="x"
								class="nogrow">
								<input
									v-model="state.currentMethod"
									type="radio"
									name="rollType"
									:value="x"
									@change="saveActionProps" />
								{{ x }}
							</label>
						</div>
					</div>
					<input v-model="state.currentStatText" @blur="saveActionProps" />
				</div>
				<textarea v-model="state.currentContent" @blur="saveText" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SheetHeaderBasic from './sheet-header-basic.vue'
import { provide, computed, reactive, inject } from 'vue'
import { get, set } from 'lodash-es'
import { $ItemKey, ItemKey } from './provisions'
import SfmoveTab from './components/sfmove-tab.vue'
import IronBtn from './components/buttons/iron-btn.vue'

const props = defineProps<{
	data: { item: any }
}>()
provide(ItemKey, computed(() => props.data.item) as any)

const $item = inject($ItemKey)

const state = reactive<{
	currentProperty: string
	currentActionPropKey?: string
	currentContent: string
	currentRollType?: string
	currentMethod?: string
	currentStatText?: string
}>({
	currentProperty: 'Text',
	currentContent: props.data.item.system.Text
})

const triggerOptions = computed(() => {
	const itemTriggerOptions = props.data.item.system.Trigger?.Options || []
	return itemTriggerOptions.map((x, i) => {
		const title = x['Action roll']
			? `Roll +${x['Action roll'].Stat}`
			: `${i + 1}`
		return {
			key: `option${i}`,
			title,
			actionPropKey: `Trigger.Options[${i}]`,
			property: `Trigger.Options[${i}].Text`
		}
	})
})

function switchContent(prop, actionPropKey?: string) {
	state.currentProperty = prop
	state.currentContent = get(props.data.item.system, prop)
	state.currentActionPropKey = actionPropKey
	// {
	//   Method: 'Any',
	//   'Roll type': 'Action roll',
	//   Text: 'Receive treatment from someone (not an ally)',
	//   Using: ['Iron'],
	//   dfid: 'Starforged/Moves/Recover/Heal/Trigger/Options/1',
	// }
	const ap =
		actionPropKey &&
		(get(props.data.item.system, actionPropKey) as any | undefined)
	state.currentRollType = ap?.['Roll type']
	state.currentMethod = ap?.Method
	state.currentStatText = ap?.Using?.join?.(',') ?? ''
}

function addTrigger() {
	let { Options } = props.data.item.system.Trigger
	Options ||= []
	Options.push({
		Text: '',
		Method: 'Any',
		'Roll type': 'Action roll',
		Using: 'Iron'
	})
	$item?.update({ system: { Trigger: { Options } } })
}

function removeTrigger(option) {
	const idx = triggerOptions.value.findIndex((x) => x.key === option.key)
	let { Options } = props.data.item.system.Trigger
	Options ||= []
	Options.splice(idx, 1)
	$item?.update({ system: { Trigger: { Options } } })
	switchContent('Text')
}

function saveActionProps() {
	if (
		!state.currentActionPropKey ||
		!state.currentStatText ||
		!state.currentActionPropKey ||
		!state.currentStatText
	)
		return

	const opt = get(props.data.item.system, state.currentActionPropKey)
	opt.Method = state.currentMethod
	opt['Roll type'] = state.currentRollType
	opt.Using = state.currentStatText.split(',').map((x) => x.trim())
	set(props.data.item.system, state.currentActionPropKey, opt)
	$item?.update({ system: props.data.item.system })
}

function saveText() {
	if (state.currentProperty.includes('Options')) {
		set(props.data.item.system, state.currentProperty, state.currentContent)
		const { Options } = props.data.item.system.Trigger
		$item?.update({ system: { Trigger: { Options } } })
	} else {
		$item?.update({
			system: { [state.currentProperty]: state.currentContent }
		})
	}
}
</script>

<style lang="scss">
.movesheet-row {
	h4 {
		align-items: center;
	}
}
</style>
