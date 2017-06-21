<template>
  <div class="cogen-audio-player">
    <div class="audio-info">
      <div class="audio-icon" @click="togglePlay()">
        <i class="fa fa-play fa-2x" v-show="!isPlaying"></i>
        <i class="fa fa-pause fa-2x" v-show="isPlaying"></i>
      </div>
      <div class="audio-text">
        <div class="audio-title">{{title}}</div>
        <div class="audio-source">来源：{{mysource}}</div>
      </div>
      <div class="audio-time">{{currentTime}} / {{duration}}</div>
    </div>
    <progress :value="playPercent" max="100" class="audio-timeline"></progress>
    <audio src="" style="display:none"></audio>
  </div>
</template>

<script>
function formatTime (tsecs) {
  let minutes = Math.floor(tsecs / 60)
  let seconds = Math.floor(tsecs) - minutes * 60
  let minitestr = (minutes >= 10) ? minutes : '0' + minutes
  let secondstr = (seconds >= 10) ? seconds : '0' + seconds
  return minitestr + ':' + secondstr
}

export default {
  name: 'AudioPlayer',
  props: {
    audioUrl: {
      type: String,
      required: true
    },
    source: String
  },
  data () {
    return {
      isPlaying: false,
      duration: '00:00',
      title: '未知',
      mysource: this.source || '未知',
      progress: 0,
      playPercent: 0,
      currentTime: '00:00'
    }
  },

  mounted () {
    this.audio = this.$el.getElementsByTagName('audio')[0]
    this.progress = this.$el.getElementsByTagName('progress')[0]
    this.audio.addEventListener('ended', this.stop, false)
    this.audio.addEventListener('loadeddata', this.loadedData, false)
    this.audio.addEventListener('loadedmetadata', this.loadedMetadata, false)
    this.audio.addEventListener('timeupdate', this.timeUpate, false)

    this.audio.src = this.audioUrl
  },

  unmounted () {

  },

  methods: {
    togglePlay () {
      if (!this.isPlaying) {
        this.play()
      } else {
        this.stop()
      }
    },

    play () {
      if (!this.isPlaying) {
        this.audio.play()
        this.isPlaying = true
      }
    },

    pause () {
      if (this.isPlaying) {
        this.audio.pause()
        this.isPlaying = false
      }
    },

    stop () {
      if (this.isPlaying) {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
        this.currentTime = '00:00'
        this.playPercent = 0
      }
    },

    timeUpate () {
      this.playPercent = Math.floor(this.audio.currentTime * 100 / this.audio.duration)
      this.currentTime = formatTime(this.audio.currentTime)
    },

    loadedData (event) {
      this.duration = formatTime(this.audio.duration)
      if (event.target.title) {
        this.title = event.target.title
      }
    }
  },

  watch: {
    audioUrl (url) {
      this.stop()
      this.audio.src = url
    }
  }

}
</script>



<style lang="scss">
.cogen-audio-player {
  width: 100%;
  background-color: #e8e8e8;
  border: 1px solid;
  border-radius: 4px;
  padding-top: 5px;
  .audio-info {
    display: flex;
    flex-flow: row;
    align-items: center;
    overflow: hidden;
    .audio-icon {
      padding-left: 10px;
      padding-right: 10px;
      width: 3rem;
    }
    .audio-text {
      flex-grow: 1;
      .audio-title {
        padding: 0;
        height: 1.25rem;
      }
      .audio-source {
        font-size: 0.8em;
      }
    }
    .audio-time {
      margin-right: 5px;
    }
  }
  .audio-timeline {
    width: 100%;
    display: block;
    height: 10px;
    border: 0;
    background-color: #000000;
  } // .audio-progress {
  //   margin-top: 10px;
  //   height: 18px;
  //   background: #4200f7;
  //   border-radius: 0 0 4px 4px;
  //   .audio-playhead {
  //     width: 18px;
  //     height: 18px;
  //     border-radius: 50%;
  //     margin-top: -5px;
  //     background: rgba(0, 255, 196, 0.82);
  //   }
  // }
}
</style>
