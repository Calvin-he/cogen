<template>
  <div class="container is-fluid">
    <header class="nav">
      <div class="nav-left">
        <a class="nav-item" @click="$router.go(-1)"><i class="fa fa-arrow-left"></i></a>
      </div>
      <div class="nav-center">
        <div class="nav-item">
          {{series.title}}
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-item">&nbsp;&nbsp;&nbsp;</div>
      </div>
    </header>
  
    <div class="section">
      <h4 class="title">{{lesson.title}}</h4>
      <div>
        <span class="publish-date">2017-06-03</span>
        <a class="public-account">公众号</a>
      </div>
      <div>
        <audio :src="lesson.mediaPath" controls></audio>
      </div>
      <article class="content" v-html="lesson.content">
      </article>
    </div>
    <footer class="footer">
    </footer>
  </div>
</template>

<script>
// import AudioPlayer from '../components/AudioPlayer'

export default {
  name: 'Lesson',
  props: {
    seriesId: {type: String, required: true},
    lessonId: {type: String, required: true}
  },

  data () {
    return {
      series: {},
      lesson: {}
    }
  },
  watch: {
    lessonId (newV) {
      this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
        this.series = this.$store.state.series[this.seriesId]
        this.lesson = lesson
      })
    }
  },

  mounted () {
    this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
      this.series = this.$store.state.series[this.seriesId]
      this.lesson = lesson
    })
  },
  components: {
    // AudioPlayer
  }
}
</script>

<style>
.full-width {
  width: 100%
}
</style>
