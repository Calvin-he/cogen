<template>
  <div>
    <div class="modal is-active" id="series-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">编辑课程系列</p>
          <button class="delete" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <series-editor :series="series" @cancel="close"></series-editor>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import SeriesEditor from './SeriesEditor'

export default {
  name: 'SeriesModal',
  components: {
    SeriesEditor
  },
  props: {
    series: {
      type: Object,
      required: true
    },
    visible: Boolean
  },
  data () {
    return {
      show: this.visible
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    console.log('Series Modal mounted')
    document.body.appendChild(this.$el)
  }
}

</script>
<style lang="scss" scoped>
#series-modal .modal-card {
  width: 80%;
  height: 80%;
}
</style>
