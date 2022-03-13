<template>
  <div class="flexcol">
    <header class="sheet-header flexrow">
      <document-img :document="actor" size="82px" />
      <div class="flexcol">
        <div class="flexrow nogrow">
          <select style="flex-basis: 300px">
            <option>planet or settlement</option>
          </select>
          <button style="flex-basis: 100px">random name</button>
        </div>
        <document-name :document="actor" />
      </div>
    </header>

    <!-- if planet -->
    <button>class</button>
    <button>settlements</button>
    <!-- "create" button at right, auto triggered when rolled -->

    <button>Observed</button>
    <button>Planetside</button>
    <button>Life</button>

    <editor
      target="data.description"
      :owner="true"
      :button="true"
      :editable="true"
      :content="actor.data.description"
    />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },
}
</script>
