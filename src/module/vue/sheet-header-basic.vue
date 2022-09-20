<template>
  <SheetHeader>
    <DocumentImg
      class="nogrow"
      :class="imgClass"
      :document="props.document"
      :size="props.imgSize"
    />
    <DocumentName :document="props.document" :class="nameClass" />
    <slot></slot>
  </SheetHeader>
</template>

<script setup lang="ts">
import DocumentName from './components/document-name.vue'
import DocumentImg from './components/document-img.vue'
import SheetHeader from './sheet-header.vue'
const props = defineProps<{
  document: any
  imgSize?: string
  nameClass?: any
  imgClass?: any
}>()
</script>
