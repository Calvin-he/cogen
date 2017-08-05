<template>
  <div class="container">
    <cogen-header :url="seriesUrl" :title="series.title">
      <router-link slot="left" :to="{name: 'LessonList', params: {seriesId: seriesId}}" replace>返回</router-link>
    </cogen-header>
    <div class="section">
      <h4 class="title">{{lesson.title}}</h4>
      <div>
        <span class="publish-date">{{lesson.updated | dateFormat}}</span>
        <router-link class="public-source" :to="{name: 'LessonList', params: {seriesId: seriesId}}" replace>{{series.title}}</router-link>
      </div>
      <audio-player :audio-url="lesson.mediaPath" class="audio-player"></audio-player>
      <article class="content" v-html="lesson.content">
      </article>
    </div>

    <Comments :lessonId="lessonId" :seriesId="seriesId"></Comments>
 
  </div>
</template>

<script>
import AudioPlayer from '../components/AudioPlayer'
import CogenHeader from '../components/CogenHeader'
import Comments from '../components/Comments'

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
    CogenHeader,
    Comments
  }
}
</script>

<style scoped>

.audio-player {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
