<template>
  <li :class="$style.wrapper" class="flexrow">
    <div v-if="editMode" class="flexcol nogrow" :class="$style.orderBtns">
      <!-- TODO: replace with better disabled attr? either aria-disabled or disabled attr -->
      <IronBtn
        icon="fa:caret-up"
        block
        nogrow
        :class="{ disabled: i == 0, [$style.orderBtn]: true }"
        @click="$emit('sortUp', i)"
      />
      <IronBtn
        icon="fa:caret-down"
        block
        nogrow
        :class="{ disabled: i == length - 1, [$style.orderBtn]: true }"
        @click="$emit('sortDown', i)"
      />
    </div>
    <div :class="[$style.content, contentWrapperClass ?? '']">
      <slot name="default"></slot>
      <div :class="$style.controls" data-tooltip-direction="UP">
        <slot name="controlsStart"></slot>
        <IronBtn
          v-if="editMode"
          block
          icon="fa:trash"
          @click="destroy"
          :tooltip="
            $t('DOCUMENT.Delete', {
              type: $t('IRONSWORN.ITEM.TypeProgressTrack'),
            })
          "
        />
        <IronBtn
          block
          icon="fa:pen-to-square"
          @click="edit"
          :tooltip="$t('IRONSWORN.Edit')"
        />

        <slot name="controls"></slot>
      </div>
    </div>
  </li>
</template>

<style lang="scss" module>
.wrapper {
}
.content {
  border-width: var(--ironsworn-border-width-md);
  border-style: solid;
  border-radius: var(--ironsworn-border-radius-sm);
  border-color: var(--ironsworn-color-border);
  padding: var(--ironsworn-spacer-sm);
}

.orderBtns {
  padding-right: var(--ironsworn-spacer-sm);
}
.orderBtn {
  padding: var(--ironsworn-spacer-xs);
}
.controls {
  display: grid;
  grid-row: 1 / span 2;
  grid-column: 4;
  grid-auto-flow: column;

  > * {
    aspect-ratio: 1;
    grid-row: 1;
  }
}
.controlBtn {
  flex-grow: 0;
  padding: var(--ironsworn-spacer-md);
}
</style>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import { inject, provide } from 'vue'
import IronBtn from '../buttons/iron-btn.vue'

const props = withDefaults(
  defineProps<{
    i: number
    length: number
    item: ReturnType<Item['toObject']>
    contentWrapperClass?: string
    deleteButton?: boolean
    editButton?: boolean
  }>(),
  { deleteButton: true, editButton: true }
)

const $actor = inject($ActorKey)
const actor = inject(ActorKey)

const $item = $actor?.items.get((props.item as any).id ?? props.item._id)

provide(ItemKey, computed(() => $item?.toObject()) as any)
provide($ItemKey, $item)

const editMode = computed(() => {
  return (actor?.value.flags as any)['foundry-ironsworn']?.['edit-mode']
})

function edit() {
  $item?.sheet?.render(true)
}

const typeLabel = computed(() => CONFIG.Item.typeLabels[props.item.type])

function destroy() {
  Dialog.confirm({
    title: game.i18n.format('DOCUMENT.Delete', {
      type: game.i18n.localize(typeLabel.value),
    }),
    content: `<p><strong>${game.i18n.localize(
      'IRONSWORN.ConfirmDelete'
    )}</strong></p>`,
    yes: () => $item?.delete(),
    defaultYes: false,
  })
}
</script>
