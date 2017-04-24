<template>
<div>    
  <div class="audio-player">
    <audio id="audio-player" :src="audioPath" :type="audioType" controls="controls"></audio>
  </div>
</div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    audioPath: {
      type: String,
      require: true
    },
    audioType: {
      type: String,
      default: 'audio/mp3'
    }
  }
}
</script>
