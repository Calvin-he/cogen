<template>
  <div class="container">
    <header class="nav">
      <div class="nav-left">
        <div class="nav-item">&nbsp;&nbsp;</div>
      </div>
      <div class="nav-center">
        <router-link class="nav-item is-bold" :to="{name: 'SeriesIntro', params: {seriesId: seriesId}}" replace>
          {{series.title}}
        </router-link>
      </div>
      <div class="nav-right">
        <div class="nav-item">&nbsp;&nbsp;</div>
      </div>
    </header>
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
        <div class="media-content" @click.stop="gotoLesson(lesson._id)">
          <h4 class="subtitle is-6">{{lesson.title}}</h4>
        </div>
        <div class="media-right" @click.stop="gotoLesson(lesson._id)">
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
      }
    },

    gotoLesson (lessonId) {
      this.$router.push({ name: 'Lesson', params: { lessonId: lessonId, seriesId: this.series._id } })
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
    InfiniteLoading
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
