<template>
  <div class="container">
    <figure class="image is-2by1">
      <img :src="series.bannerUrl">
    </figure>
  
    <section class="section">
      <h4 class="subtitle is-4">{{series.title}}</h4>
      <p class="content">{{series.desc}}
      </p>
    </section>
    <section class="section">
      <h4 class="subtitle is-4">购买须知</h4>
      <p class="content">。。。。
      </p>
    </section>
  
    <div class="footer">
      <div class="columns is-mobile" v-if="!paid">
        <div class="column">
          <a class=" button is-primary is-outlined" @click="gotoLessonList">试课</a>
        </div>
        <div class="column">
          <a class="button is-primary" @click.stop.prevent="gotoPayment">付款</a>
        </div>
      </div>
      <div class="columns is-mobile" v-else>
        <div class="column">
          <a class="button is-primary is-outlined" @click.stop.prevent="gotoLessonList">查看课程列表</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeriesIntro',
  props: {
    seriesId: {
      type: String,
      requried: true
    }
  },
  data () {
    return {
      series: {}
    }
  },

  computed: {
    paid () {
      return false
    }
  },

  mounted () {
    let seriesId = this.seriesId
    this.$store.dispatch('getSeries', seriesId).then((series) => {
      this.series = series
    }).catch((error) => {
      console.error(error)
      this.series = { title: '课程不存在' }
    })
  },

  methods: {
    gotoLessonList () {
      this.$router.push({name: 'LessonList', params: {series_id: this.series._id}})
    },

    gotoPayment () {
      this.$router.push({name: 'payment', params: {series_id: this.series_id}})
    }
  }
}
</script>


<style scoped>
.banner {
  width: 100%;
}
.footer .button {
  width: 100%;
}
</style>
