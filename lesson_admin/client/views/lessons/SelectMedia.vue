<template>
  <div class="columns">
    <div class="column is-two-thirds">
      <v-select v-model="selected" :options="mediaList"  label="path"
        :getOptionLabel="getOptionLabel" :on-change="onChangeMedia" :placeholder="placeholder"></v-select>
    </div>
    <div class="column">
      <label class="button file-upload" :class="{'is-loading': uploading}" title="点击选择文件上传">
        <span class="icon">
          <i class="fa fa-upload"></i>
        </span>
        <span>上传更多</span>
        <input type="file" @change="onFileChange" class="upload" :accept="accept" />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectMedia',
  props: {
    value: {
      type: String, // media id
      default: null
    },
    extensions: {
      type: String,
      default: null
    },

    accept: {
      type: String,
      default: ''
    },
    placeholder: String
  },

  data () {
    return {
      uploading: false
    }
  },

  computed: {
    mediaList () {
      if (this.extensions && this.extensions.length) {
        let types = this.extensions.split('|').map(v => '\\.' + v.trim() + '$')
        let regex = new RegExp(types.join('|'), 'i')
        return this.$store.state.lesson.mediaList.filter(v => v.path.search(regex) !== -1)
      } else {
        return this.$store.state.lesson.mediaList
      }
    },

    selected () {
      if (this.value) {
        return this.$store.state.lesson.mediaList.find((item) => item._id === this.value)
      } else {
        return null
      }
    }
  },

  mounted () {
    this.$store.dispatch('listMedia')
    // if (this.value) {
    //   this.selected = this.$store.state.lesson.mediaList.find((item) => item._id === this.value)
    // } else {
    //   this.select = null
    // }
  },

  methods: {
    onFileChange (event) {
      if (event.target.files == null || event.target.files[0] == null) {
        return
      }
      let file = event.target.files[0]
      this.uploading = true
      this.$store.dispatch('addMedia', file).then((media) => {
        this.$emit('input', media._id)
        this.selected = media
        this.uploading = false
      }).catch((e) => {
        console.log(e)
        this.uploading = false
      })
    },
    onChangeMedia (val) {
      if (val && val._id) {
        this.$emit('input', val._id)
        this.$emit('change', val)
      } else {
        this.$emit('input', null)
        this.$emit('change', null)
      }
    },
    getOptionLabel (media) {
      if (!media['label']) {
        let idx = media.path.lastIndexOf('/')
        media['label'] = media.path.substr(idx + 1)
      }
      return media['label']
    }
  }
}
</script>

<style>
.file-upload {
  position: relative;
  overflow: hidden;
}

.file-upload input.upload {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
}

.lesson-audio {
  display: inline-block;
  height: 2.5rem;
  line-height: 2.5rem;
  vertical-align: middle;
  text-align: center;
}

.lesson-audio audio,
.lesson-audio span {
  height: 2.5rem;
  vertical-align: middle;
  margin-right: 10px;
}
</style>
