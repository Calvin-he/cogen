<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <div class="tile is-child">
          <a class="button is-primary" title="新增课程" @click="toggleLessonDetails(newLesson)">
            新增课程&nbsp;
            <span v-show="!expanded[0]">
              <i class="fa fa-angle-right fa-2x"></i>
            </span>
            <span v-show="expanded[0]">
              <i class="fa fa-angle-down fa-2x"></i>
            </span>
          </a>
          <div class="box" v-show="expanded[0]">
            <lesson-editor :lesson="newLesson"></lesson-editor>
          </div>
        </div>
  
        <article class="tile is-child box">
          <h4 class="title">所有课程</h4>
          <table class="table is-narrow">
            <thead>
              <tr>
                <th>序号</th>
                <th>课程名称</th>
                <th>录音</th>
                <th>更新时间</th>
                <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(lesson, index) in lessonList">
                <tr>
                  <td>{{index+1}}</td>
                  <td>{{lesson.title}}</td>
                  <td>
                    <a class="button is-success is-small" @click="togglePlayer(lesson)" 
                      v-show="lesson._id!==playingLessonId" title="播放">
                      <span class="icon is-small"><i class="fa fa-play"></i></span>
                    </a>
                    <a class="button is-success is-small" @click="togglePlayer(lesson)" 
                      v-show="lesson._id===playingLessonId" title="停止">
                      <span class="icon is-small"><i class="fa fa-stop"></i></span>
                    </a>
                    <span class="media-name">{{mediaFileName(lesson.mediaPath)}}
                    </span>
  
                  </td>
                  <td>{{lesson.updated | date}}</td>
                  <td>
                    <a class="button" v-show="!expanded[lesson._id]" @click="toggleLessonDetails(lesson)">
                      展开&nbsp;
                      <i class="fa fa-angle-right fa-2x"></i>
                    </a>
                    <a class="button is-primary" v-show="expanded[lesson._id]" @click="toggleLessonDetails(lesson)">
                      隐藏&nbsp;
                      <i class="fa fa-angle-down fa-2x"></i>
                    </a>
                  </td>
                </tr>
                <tr v-if="expanded[lesson._id]">
                  <td colspan="5">
                    <lesson-editor :lesson="lesson"></lesson-editor>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </article>
        <audio ref="playingAudio"></audio>
      </div>
    </div>
  </div>
</template>

<script>
import LessonEditor from './LessonEditor'

export default {
  data () {
    return {
      expanded: { 0: true },
      newLesson: {
        title: '',
        mediaId: null,
        content: ''
      },
      playingLessonId: ''
    }
  },
  computed: {
    lessonList () {
      return this.$store.state.lesson.lessonList
    }
  },
  methods: {
    loadLessons () {
      this.$store.dispatch('listLessons')
    },

    toggleLessonDetails (lesson) {
      let lid = lesson._id
      if (lid) {
        this.$set(this.expanded, lid, !this.expanded[lid])
      } else {
        this.$set(this.expanded, 0, !this.expanded[0])
      }
    },

    mediaFileName (mediaPath) {
      if (mediaPath) {
        let name = mediaPath.substr(mediaPath.lastIndexOf('/') + 1)
        return name.substr(name.indexOf('-') + 1)
      } else {
        return null
      }
    },
    togglePlayer (lesson) {
      if (this.playingLessonId !== lesson._id) {
        this.audioPlayer.src = lesson.mediaPath
        this.playingLessonId = lesson._id
        this.audioPlayer.play()
      } else {
        this.audioPlayer.pause()
        this.audioPlayer.currentTime = 0
        this.audioPlayer.src = ''
        this.playingLessonId = null
      }
    }
  },
  mounted () {
    this.loadLessons()
    this.audioPlayer = this.$refs.playingAudio
  },
  components: {
    LessonEditor
  }
}

</script>
<style>
.media-name {
  display: inline-block;
  max-width: 30rem;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
