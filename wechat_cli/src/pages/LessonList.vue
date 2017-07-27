<template>
  <div class="container">
    <cogen-header :url="seriesUrl" :title="series.title"></cogen-header>
    <div class="section">
      <div class="media" v-for="lesson in lessonList" v-bind:key="lesson._id">
        <div class="media-left">
          <a class="button is-primary is-outlined" @click.prevent="play(lesson)">
            <span class="icon">
              <i class="fa fa-lock" v-if="!lesson.mediaPath"></i>
              <i class="fa fa-pause" v-else-if="lesson === currentPlayingLesson"></i>
              <i class="fa fa-play" v-else></i>
            </span>
          </a>
        </div>
        <div class="media-content" @click.stop="gotoLesson(lesson)">
          <h4 class="subtitle is-6">{{lesson.title}}</h4>
        </div>
        <div class="media-right" @click.stop="gotoLesson(lesson)">
          <span class=" icon ">
            <i class="fa fa-angle-right "></i>
          </span>
        </div>
      </div>
      <infinite-loading :on-infinite="onInfinite " distances="50 " ref="infiniteLoading" spinner="circles">
        <span slot="no-more">全部加载完毕</span>
      </infinite-loading>
    </div>
    <audio src=""></audio>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import CogenHeader from '../components/CogenHeader'

export default {
  name: 'LessonList',
  props: {
    seriesId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      series: {},
      lessonList: [],
      count: 0,
      currentPlayingLesson: null
    }
  },
  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    }
  },
  mounted () {
    this.audio = this.$el.getElementsByTagName('audio')[0]
  },
  methods: {
    onInfinite () {
      if (this.series._id == null) {
        this.$store.dispatch('getSeries', this.seriesId).then((series) => {
          this.series = series
          this._loadMoreLessons()
        })
      } else {
        this._loadMoreLessons()
      }
    },

    _loadMoreLessons () {
      let loadLen = this.lessonList.length
      let totalLen = this.series.lessonList.length
      if (loadLen < totalLen) {
        let endIdx = (loadLen + 10) <= totalLen ? (loadLen + 10) : totalLen
        let ids = this.series.lessonList.slice(loadLen, endIdx)
        this.$store.dispatch('queryLesson', { seriesId: this.series._id, lessonIds: ids }).then((lessons) => {
          this.lessonList.push(...lessons)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          if (endIdx >= totalLen) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      } else {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
      }
    },

    gotoLesson (lesson) {
      if (lesson.mediaPath) {
        this.$router.push({ name: 'Lesson', params: { lessonId: lesson._id, seriesId: this.series._id } })
      } else {
        this.$store.dispatch('showMessage', {msg: 'Sorry, 购买后才能查看。', level: 'warning'})
      }
    },

    play (lesson) {
      if (!lesson.mediaPath) {
        return
      } else if (lesson !== this.currentPlayingLesson) {
        this.currentPlayingLesson = lesson
        this.audio.src = lesson.mediaPath
        this.audio.play()
      } else {
        this.currentPlayingLesson = null
        this.audio.pause()
        this.audio.src = ''
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.currentPlayingLesson != null) {
      this.currentPlayingLesson = null
      this.audio.pause()
      this.audio.src = ''
    }
    next()
  },

  components: {
    InfiniteLoading,
    CogenHeader
  }
}
</script>

<style lang="scss">
.section {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.media {
  align-items: center;
}

</style>
