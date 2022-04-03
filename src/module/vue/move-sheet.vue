<template>
  <div class="flexcol">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <!-- Stats -->
    <div class="flexrow">
      <label class="checkbox">
        <input type="checkbox">
        {{ $t('IRONSWORN.Edge') }}
      </label>
    </div>

    <hr class="nogrow">

    <!-- Editors -->
    <div class="flexrow">
      <div class="flexcol nogrow">
        <div class="clickable block tab nogrow selected">Full Text</div>
        <div class="clickable block tab nogrow">Description</div>
        <div class="clickable block tab nogrow">Strong Hit</div>
      </div>
      <div class="flexcol">
        <quill-editor v-model="item.data.fulltext" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab {
  padding: 5px;
  text-align: left;
}
</style>

<script>
export default {
  props: {
    item: Object,
  },
}
</script>
