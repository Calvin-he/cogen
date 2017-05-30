<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
// if (!window.Quill) {
//   window.Quill = require('quill/dist/quill.js')
// }
import Quill from 'quill'
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
      }
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
    imageHandler () {
      let imageButton = this.$el.querySelector('.ql-toolbar')
      let fileInput = imageButton.querySelector('input[type=file]')
      if (fileInput == null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
        fileInput.style.visibility = 'hidden'
        fileInput.style.width = '0.1px'
        fileInput.addEventListener('change', () => {
          if (fileInput.files != null && fileInput.files[0] != null) {
            this.$store.dispatch('addMedia', fileInput.fiels[0]).then((media) => {
              let range = this.quill.getSelection(true)
              console.log('range: ', range)
              this.quill.updateContents(new Delta()
                    .retain(range.index)
                    .delete(range.length)
                    .insert({ image: media.path }))
              fileInput.value = ''
            })
          }
        })
        imageButton.appendChild(fileInput)
      }
      fileInput.click()
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
  }
}
</script>

<style lang="styl">
@import '~quill/assets/core';
@import "~quill/assets/snow";
@import "~quill/assets/bubble";
.quill-editor .ql-editor {
  height: 15rem;
}

.quill-editor .ql-tooltip {
  margin-left: 140px;
  z-index: 100;
}
</style>
