<template>
  <div class="editor-wrapper">
    <div class="editor">
      <div
        class="editor-content"
        :data-edit="target"
        v-html="enrichHtml()"
      ></div>
      <a class="editor-edit" v-if="canEdit"><i class="fas fa-edit"></i></a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['owner', 'target', 'content', 'button', 'editable'],
  data: function () {
    return {
      canEdit: false,
    }
  },
  computed: {},
  methods: {
    enrichHtml() {
      const button = Boolean(this.button)
      const editable = Boolean(this.editable)
      this.canEdit = button && editable
      let editor = TextEditor.enrichHTML(this.content || '', {
        secrets: this.owner,
        entities: true,
      })
      return editor
    },
  },
}
</script>
