<template>
  <div>
    <a class="button is-primary" :class="{'is-loading': uploading}">
      <file-upload post-action="/post.method" put-action="/put.method" accept="image/*" 
        :title="title" :multiple="false" :files="files" :events="events" ref="upload">
      </file-upload>
    </a>
    <div v-if="files.length==1">
      <span>{{files[0].name}}</span>
      <figure class="image is-128x128">
        <img src="http://bulma.io/images/placeholders/128x128.png">
      </figure>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'

export default {
  name: 'UploadImage',
  data () {
    let self = this
    return {
      title: '上传图片',
      files: [],
      uploading: false,
      events: {
        add (file, component) {
          console.log('add')
          console.log(file)
          component.active = true
        },
        progress (file, component) {
          console.log('progress ' + file.progress)
        },
        after (file, component) {
          console.log('after')
          self.uploading = false
        },
        before (file, component) {
          console.log('before')
          self.uploading = true
        }
      }
    }
  },
  computed: {
  },
  components: {
    FileUpload
  }
}
</script>
