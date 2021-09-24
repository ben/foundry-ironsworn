<template>
  <div class="flexcol item-row nogrow">
    <div class="flexrow">
      <img
        class="profile-img nogrow"
        :src="item.img"
        :title="item.name"
        height="38"
        style="margin-right: 5px"
      />
      <div class="flexcol">
        <div class="flexrow">
          <!-- <div class="flexrow">{{>rankHexes rank=data.data.rank id=id}}</div> -->

          <div
            v-if="editMode"
            class="clickable block nogrow progress-button"
          >
            <i class="fas fa-trash"></i>
          </div>

          <div
            class="clickable block nogrow progress-button"
          >
            <i class="fas fa-edit"></i>
          </div>
          <div
            class="clickable block nogrow progress-button"
            :title="$t('IRONSWORN.MarkProgress')"
          >
            <i class="fas fa-play"></i>
          </div>
          <div
            class="clickable block progress-button ironsworn__progress__fulfill"
            :title="$t('IRONSWORN.ProgressRoll')"
            style="flex-grow: 0"
          >
            <i class="fas fa-dice-d6"></i>
          </div>
        </div>
        <h4>{{ item.name }}</h4>
      </div>
    </div>
    <div class="flexrow">
      <div class="flexrow track">
        <progress-track :ticks="item.data.current" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: { type: Object, required: true },
    item: { type: Object, required: true },
  },

  computed: {
    editMode() {
      return this.actor.flags['foundry-ironsworn']['edit-mode']
    },
  },
}
</script>
