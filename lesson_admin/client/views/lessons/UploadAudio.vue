<template>
  <div>
    <label class="button is-primary file-upload" :class="{'is-loading': uploading}" title="点击上传">
      <span class="icon">
        <i class="fa fa-upload"></i>
      </span>
      <span>上传录音</span>
      <input type="file" @change="onFileChange" class="upload" accept="audio/*"/>
    </label>
    <span>
    <v-select v-model="selected" :options="audioList" :label="_id"></v-select>
    </span>
    <span v-show="mediaPath" class="lesson-audio">
      <audio controls :src="mediaPath">
      </audio>
      <span>{{filename}}</span>
    </span>
  </div>
</template>

<script>
import { lessonHttp } from '../../api/LessonApi'

const EVENT_CHANGE_MEDIA = 'change-media'
export default {
  name: 'UploadAudio',
  props: {
    mediaUrl: String
  },
  data () {
    return {
      mediaPath: this.mediaUrl,
      uploading: false
    }
  },
  mounted () {
  },
  computed: {
    filename () {
      if (this.mediaPath) {
        let name = this.mediaPath.substr(this.mediaPath.lastIndexOf('/') + 1)
        return name.substr(name.indexOf('-') + 1)
      } else {
        return null
      }
    }
  },
  methods: {
    onFileChange (event) {
      if (event.target.files == null || event.target.files[0] == null) {
        return
      }
      let file = event.target.files[0]
      let formData = new window.FormData()
      formData.append('file', file)

      let config = {
        timeout: 10000,
        onUploadProgress: (progressEvent) => {
          // var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // console.log('finished: ' + percentCompleted + '%')
        }
      }
      this.uploading = true
      lessonHttp.post('media', formData, config).then((response) => {
        this._mediaObj2LocalData(response.data)
        this.uploading = false
      }).catch((response) => {
        console.log(response.data)
        this.uploading = false
      })
    },
    _mediaObj2LocalData (media) {
      if (this.mediaPath !== media.path) {
        this.mediaPath = media.path
        this.$emit(EVENT_CHANGE_MEDIA, media)
      }
    }
  },
  components: {
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

.lesson-audio audio, .lesson-audio span{
     height: 2.5rem;
     vertical-align: middle;
     margin-right: 10px;
}


</style>
