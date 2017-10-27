<template>
<div>
  <table class="table">
    <thead>
      <tr>
        <th>Index</th>
        <th>Title</th>
        <th>Created Time</th>
        <th>View</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(media, index) in mediaList" :key="media._id">
        <td>{{index+1}}</td>
        <td>{{media.path|media-title}}</td>
        <td>{{media.created|date}}</td>
        <td>
          <div v-if="isAudio(media.path)">
            <audio controls>
              <source :src="media.path" type="audio/mpeg" />
            </audio>
          </div>
        </td>
        <td>
          <a class="button is-danger is-outlined" title="Delete this media">
            <span class="icon">
              <i class="fa fa-trash"></i>
            </span>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <pagination :total-num="allMedia.length" :page-size="10"  @goto-page="loadPageData"/>
</div>
</template>

<script>
import Pagination from '../../components/common/Pagination'

export default {
  data () {
    return {
      allMedia: this.$store.state.lesson.mediaList,
      mediaList: []
    }
  },
  created () {
    let mediaList = this.$store.state.lesson.mediaList
    this.mediaList = mediaList.slice(0, 10)
  },
  methods: {
    loadPageData (pageNum) {
      let pageSize = 10
      let mediaList = this.$store.state.lesson.mediaList
      let start = (pageNum - 1) * pageSize
      let end = (start + pageSize < mediaList.length) ? (start + pageSize) : mediaList.length
      this.mediaList = mediaList.slice(start, end)
    },
    isAudio (mediaPath) {
      return mediaPath.endsWith('.mp3')
    }
  },
  components: {
    Pagination
  }
}
</script>

<style>
  audio {
    height: 32px;
  }
</style>
