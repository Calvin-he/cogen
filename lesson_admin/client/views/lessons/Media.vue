<template>
<div>
  <table class="table">
    <thead>
      <tr>
        <th>Index</th>
        <th>Title</th>
        <th>Created Time</th>
        <th>Operation</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(media, index) in mediaList" :key="media._id">
        <td>{{index+1}}</td>
        <td>{{media.path|media-title}}</td>
        <td>{{media.created|date}}</td>
        <td><a class="button is-primary">Delete</a></td>
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
      console.log(pageNum)
      let pageSize = 10
      let mediaList = this.$store.state.lesson.mediaList
      let start = (pageNum - 1) * pageSize
      let end = (start + pageSize < mediaList.length) ? (start + pageSize) : mediaList.length
      this.mediaList = mediaList.slice(start, end)
    }
  },
  components: {
    Pagination
  }
}
</script>

<style>

</style>
