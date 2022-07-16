
<template>
  <div :class="classes" @click="click">
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow" style="position: relative">
      <div v-if="!editMode" class="bg-die">
        <i class="isicon-d10-tilt"></i>
      </div>
      <div class="clickable text" v-if="editMode" @click="decrement">
        &minus;
      </div>
      <h4>{{ actor.data[attr] }}</h4>
      <div class="clickable text" v-if="editMode" @click="increment">
        &plus;
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg-die {
  position: absolute;
  left: 19px;
  top: -17px;
  opacity: 0;
  font-size: 35px;
}

.stat:hover .bg-die {
  transition: opacity 0.4s ease;
  opacity: 0.2;
}
</style>

<script lang="ts" setup>
import { inject, computed, capitalize, Ref } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { RollDialog } from '../../helpers/rolldialog'

const props = defineProps({ attr: { type: String, required: true } })
const $actor = inject('$actor') as IronswornActor
const actor = inject('actor') as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject>
>

const clickable = computed(() => (this.editMode.value ? '' : ' clickable '))
const classes = computed(() => ({
  stat: true,
  block: true,
  clickable: clickable,
}))
const i18nKey = computed(() => `IRONSWORN.${capitalize(props.attr)}`)
const editMode = computed(
  () => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

function click() {
  if (editMode.value) return
  RollDialog.show({ actor: $actor, stat: props.attr })
}

function increment() {
  const value = parseInt(actor.value.data[props.attr]) + 1
  $actor?.update({ data: { [props.attr]: value } })
}
function decrement() {
  const value = parseInt(actor.value.data[props.attr]) - 1
  $actor?.update({ data: { [props.attr]: value } })
}
</script>
