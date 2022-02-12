<template>
  <!-- Poached fairly from Archmage https://git.io/JKUjs -->
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
  props: {
    owner: {
      type: Boolean,
      default: false,
    },
    target: String,
    content: String,
    button: Boolean,
    editable: Boolean,
  },
  data: function () {
    return {
      canEdit: false,
    }
  },
  computed: {},
  methods: {
    enrichHtml() {
      this.canEdit = this.button && this.editable
      let editor = TextEditor.enrichHTML(this.content || '', {
        secrets: this.owner,
        documents: true,
      })
      return editor
    },
  },
}
</script>
