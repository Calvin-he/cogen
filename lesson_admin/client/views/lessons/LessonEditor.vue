<template>
  <loading class="control" :loading="isloading">
    <p class="control">
      <input class="input" type="text" placeholder="课程名称" v-model.trim="ctrl_title.value" @blur="validateTitle">
      <span class="help is-danger" v-show="ctrl_title.errors.required">课程名称不能为空</span>
    </p>
  
    <p class="control">
      <select-media v-model="ctrl_mediaId.value" @change="validateAudio" placeholder="选择录音材料" extensions="mp3" accept="audio/mpeg"></select-media>
      <span class="help is-danger" v-show="ctrl_mediaId.errors.required">必须选择录音材料</span>
    </p>
  
    <p class="control">
      <quill-editor v-model="ctrl_content.value" ref="myQuillEditor"></quill-editor>
    </p>
  
    <!--p class="control has-addons">
      <label class="label">添加到课程系列</label>
      <v-select :options="seriesList" label="title"  multiple></v-select>
    </p-->
  
    <p class="control">
      <button type="submit" class="button is-primary" @click="submit">提交</button>
      <button class="button" @click="reset">重置</button>
    </p>
  </loading>
</template>

<script>
import SelectMedia from './SelectMedia'
import QuillEditor from './QuillEditor'
import Loading from './Loading'

export default {
  name: 'LessonEditor',
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isloading: false,
      ctrl_title: { value: this.lesson.title, errors: {} },
      ctrl_mediaId: { value: this.lesson.mediaId, errors: {} },
      ctrl_content: { value: this.lesson.content, errors: {} }

    }
  },
  computed: {
    seriesList () {
      this.$store.dispatch('listSeries')
      return this.$store.state.lesson.seriesList
    }
  },
  mounted () {
    this.reset()
  },

  methods: {
    validateTitle () {
      this.$set(this.ctrl_title.errors, 'required', this.isEmptyString(this.ctrl_title.value))
      return !this.ctrl_title.errors.required
    },

    validateAudio () {
      this.$set(this.ctrl_mediaId.errors, 'required', this.isEmptyString(this.ctrl_mediaId.value))
      return !this.ctrl_mediaId.errors.required
    },

    isNew () {
      return !this.lesson._id
    },

    updateContent (editor) {
      this.ctrl_content.value = editor.getText()
    },

    submit () {
      let valid = this.validateTitle()
      valid = this.validateAudio() && valid
      if (!valid) {
        return false
      }
      if (this.isNew()) {
        let data = {
          title: this.ctrl_title.value,
          mediaId: this.ctrl_mediaId.value,
          content: this.ctrl_content.value
        }
        this.isloading = true
        this.$store.dispatch('addLesson', data).then(() => {
          this.reset()
          this.isloading = false
        })
      } else {
        let data = {}
        if (this.lesson.title !== this.ctrl_title.value) {
          data.title = this.ctrl_title.value
        }
        if (this.lesson.mediaId !== this.ctrl_mediaId.value) {
          data.mediaId = this.ctrl_mediaId.value
        }
        if (this.lesson.content !== this.ctrl_content.value) {
          data.content = this.ctrl_content.value
        }
        if (Object.keys(data).length > 0) {
          data._id = this.lesson._id
          this.isloading = true
          this.$store.dispatch('updateLesson', data).then(() => {
            this.isloading = false
          })
        }
      }
    },

    reset () {
      this.ctrl_title = {
        value: this.lesson.title,
        errors: {}
      }
      this.ctrl_mediaId = {
        value: this.lesson.mediaId,
        errors: {}
      }
      this.ctrl_content = {
        value: this.lesson.content,
        errors: {}
      }
    },

    isEmptyString (v) {
      return v === null || v.trim().length === 0
    }
  },
  components: {
    SelectMedia,
    QuillEditor,
    Loading
  }
}
</script>
