<template>
  <div class="flexcol item-row">
    <!-- <div class="flexrow">
      <img
        class="profile-img nogrow"
        src="{{img}}"
        title="{{name}}"
        height="38"
        style="margin-right: 5px"
      />
      <div class="flexcol">
        <div class="flexrow">
          <div class="flexrow">{{>rankHexes rank=data.data.rank id=id}}</div>

          {{#if actor.data.flags.foundry-ironsworn.edit-mode}}
          <div
            class="clickable block nogrow progress-button ironsworn__{{type}}__delete"
            data-item="{{id}}"
          >
            <i class="fas fa-trash"></i>
          </div>
          {{/if}}

          <div
            class="clickable block nogrow progress-button ironsworn__{{type}}__settings"
            data-item="{{id}}"
          >
            <i class="fas fa-edit"></i>
          </div>
          <div
            class="
              clickable
              block
              nogrow
              progress-button
              ironsworn__progress__mark
            "
            {{!
            This
            works
            for
            vows
            too
            }}
            title="{{localize 'IRONSWORN.MarkProgress'}}"
            data-item="{{id}}"
          >
            <i class="fas fa-play"></i>
          </div>
          <div
            class="clickable block progress-button ironsworn__progress__fulfill"
            title="{{localize 'IRONSWORN.ProgressRoll'}}"
            style="flex-grow: 0"
            data-item="{{id}}"
          >
            <i class="fas fa-dice-d6"></i>
          </div>
        </div>
        <h4>{{ name }}</h4>
      </div>
    </div>
    <div class="flexrow">
      <div class="flexrow track">
        {{#each (progressCharacters data.data.current)}}
        <div class="flexcol track-box">{{{this}}}</div>
        {{/each}}
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
}
</script>
