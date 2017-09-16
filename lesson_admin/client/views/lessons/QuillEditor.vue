<template>
  <div style="position: relative">
    <div class="quill-editor">
      <slot name="toolbar"></slot>
      <div ref="editor"></div>
    </div>
    <div class="modal" :class="{'is-active': showSelectMediaModal}" style="position: absolute; overflow: visible;">
      <div class="modal-background"></div>
      <div class="modal-card" style="overflow:visible;">
        <header class="modal-card-head">
          <p class="modal-card-title">插入图片</p>
          <button class="delete" aria-label="close" @click="toggleModal"></button>
        </header>
        <section class="modal-card-body" style="overflow: visible">
          <select-media extensions="png|gif|jpg|jpeg|bmp|ico"  @change="selectPict" placeholder="请选择要插入的图片"
            accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon"></select-media>
          <img :src="selectedPict" alt="NO PICTURE SELECTED">  
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="insertPict">插入</button>
          <button class="button" @click="toggleModal">取消</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
// if (!window.Quill) {
//   window.Quill = require('quill/dist/quill.js')
// }
import Quill from 'quill'
import SelectMedia from './SelectMedia'
import Delta from 'quill-delta'

export default {
  name: 'QuillEditor',
  data () {
    return {
      _content: '',
      defaultModules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ]
      },
      showSelectMediaModal: false,
      selectedPict: ''
    }
  },
  props: {
    content: String,
    value: String,
    disabled: Boolean,
    options: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.initialize()
  },
  beforeDestroy () {
    this.quill = null
  },
  methods: {
    initialize () {
      if (this.$el) {
        // options and instance
        var self = this
        self.options.theme = self.options.theme || 'snow'
        self.options.boundary = self.options.boundary || document.body
        self.options.modules = self.options.modules || self.defaultModules
        self.options.modules.toolbar = self.options.modules.toolbar !== undefined
          ? self.options.modules.toolbar
          : self.defaultModules.toolbar
        self.options.placeholder = self.options.placeholder || '输入正文...'
        self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
        self.quill = new Quill(self.$refs.editor, self.options)
        // set editor content
        if (self.value || self.content) {
          self.quill.pasteHTML(self.value || self.content)
        }
        var toolbar = self.quill.getModule('toolbar')
        toolbar.addHandler('image', this.imageHandler)

        // mark model as touched if editor lost focus
        self.quill.on('selection-change', (range) => {
          if (!range) {
            self.$emit('blur', self.quill)
          } else {
            self.$emit('focus', self.quill)
          }
        })
        // update model if text changes
        self.quill.on('text-change', (delta, oldDelta, source) => {
          var html = self.$refs.editor.children[0].innerHTML
          const text = self.quill.getText()
          if (html === '<p><br></p>') html = ''
          self._content = html
          self.$emit('input', self._content)
          self.$emit('change', {
            editor: self.quill,
            html: html,
            text: text
          })
        })
        // emit ready
        self.$emit('ready', self.quill)
      }
    },
    toggleModal () {
      this.showSelectMediaModal = !this.showSelectMediaModal
    },
    selectPict (media) {
      if (media) {
        this.selectedPict = media.path
      } else {
        this.selectedPict = null
      }
    },
    insertPict (mediaPath) {
      if (this.selectedPict) {
        let range = this.quill.getSelection(true)
        this.quill.updateContents(new Delta().retain(range.index)
          .delete(range.length).insert({image: this.selectedPict}))
        this.toggleModal()
      }
    },
    imageHandler () {
      this.toggleModal()
    }
  },
  watch: {
    'content' (newVal, oldVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    'value' (newVal, oldVal) {
      if (this.quill) {
        if (newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    'disabled' (newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  },
  components: {
    SelectMedia
  }
}
</script>

<style lang="styl">
@import '~quill/assets/core';
@import "~quill/assets/snow";
@import "~quill/assets/bubble";
.quill-editor .ql-editor {
  height: 30rem;
}
.quill-editor .ql-tooltip {
  margin-left: 140px;
  z-index: 100;
}
</style>
