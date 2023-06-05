<template>
	<div class="flexcol nogrow" style="margin-top: 1em">
		<CollapseTransition group tag="div" class="nogrow">
			<div
				v-for="(ability, i) in abilities"
				:key="`ability${i}`"
				class="flexcol nogrow">
				<textarea
					v-model="ability.description"
					rows="5"
					style="min-height: 90px"
					@blur="save"></textarea>
				<div class="flexrow">
					<div class="form-group">
						<label class="flexrow">
							<input
								type="checkbox"
								:checked="ability.hasClock"
								@change="enableClock(i)" />
							{{ $t('IRONSWORN.Clock') }}
						</label>
						<select
							v-model="ability.clockMax"
							class="nogrow"
							style="margin: 0.5rem 0"
							@change="clockMaxChange(i)">
							<option value="4">4 segments</option>
							<option value="6">6 segments</option>
							<option value="8">8 segments</option>
							<option value="10">10 segments</option>
							<option value="12">12 segments</option>
						</select>
					</div>
					<div class="form-group" style="justify-content: right">
						<IronBtn
							icon="fa:trash"
							block
							nogrow
							:class="{ disabled: abilities.length < 2 }"
							@click="deleteAbility(i)" />
					</div>
				</div>

				<hr />
			</div>
		</CollapseTransition>
		<IronBtn
			icon="fa:plus"
			block
			:text="$t('IRONSWORN.Ability')"
			@click="addAbility" />
	</div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import IronBtn from 'component:buttons/iron-btn.vue'
import type { IronswornItem } from '../../../item/item'

const item = inject<Ref<ItemSource<'asset'>>>(ItemKey)
const $item = inject<IronswornItem<'asset'>>($ItemKey)

const editMode = computed(
	() => item?.value.flags['foundry-ironsworn']?.['edit-mode']
)

const abilities = computed(() =>
	Object.values(item?.value.system.abilities ?? [])
)

function deleteAbility(idx: number) {
	abilities.value.splice(idx, 1)
	$item?.update({ system: { abilities } })
}

function addAbility() {
	abilities.value.push({
		description: '',
		enabled: false,
		hasClock: false,
		clockMax: 4,
		clockTicks: 0
	})
	$item?.update({ system: { abilities } })
}

function enableClock(idx: number) {
	abilities.value[idx] = {
		...abilities[idx],
		hasClock: !abilities[idx].hasClock
	}
	$item?.update({ system: { abilities } })
}

function clockMaxChange(idx: number) {
	abilities.value[idx].clockMax = parseInt(abilities[idx].clockMax)
	$item?.update({ system: { abilities } })
}

function save() {
	$item?.update({ system: { abilities } })
}
</script>
