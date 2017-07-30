<template>
  <div class="container">
    <cogen-header :url="seriesUrl" :title="series.title">
      <router-link slot="left" :to="{name: 'LessonList', params: {seriesId: seriesId}}" replace>返回</router-link>
    </cogen-header>
    <div class="section">
      <h4 class="title">{{lesson.title}}</h4>
      <div>
        <span class="publish-date">2017-06-03</span>
        <a class="public-account">何老师认知英语</a>
      </div>
      <audio-player :audio-url="lesson.mediaPath" class="audio-player"></audio-player>
      <article class="content" v-html="lesson.content">
      </article>
    </div>
    <div class="section" id="comment-list">
      <
    </div>
    <footer class="footer">
    </footer>
  </div>
</template>

<script>
import AudioPlayer from '../components/AudioPlayer'
import CogenHeader from '../components/CogenHeader'

export default {
  name: 'Lesson',
  props: {
    seriesId: { type: String, required: true },
    lessonId: { type: String, required: true }
  },

  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    }
  },

  data () {
    return {
      series: {},
      lesson: { mediaPath: '' }
    }
  },
  watch: {
    lessonId (newV) {
      this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
        this.series = this.$store.state.series
        this.lesson = lesson
      })
    }
  },

  mounted () {
    this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
      this.series = this.$store.state.series
      this.lesson = lesson
    })
  },
  components: {
    AudioPlayer,
    CogenHeader
  }
}
</script>

<style>
.full-width {
  width: 100%
}

.audio-player {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
