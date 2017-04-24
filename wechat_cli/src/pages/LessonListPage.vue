<template>
  <div>
    <mt-header :title="title"
               fixed></mt-header>
    <div v-infinite-scroll="loadMore"
         infinite-scroll-disabled="disableInfiniteScroll"
         infinite-scroll-distance="10">
      <mt-cell :title="lesson.title"
               is-link
               to="/lessons/1"
               v-for="lesson in lessonList">
        <img slot="icon"
             :src="lesson.poster"
             width="50"
             height="50">
      </mt-cell>
    </div>
    <p style="position:relative; left:48%;">
    <mt-spinner v-show="loadStatus===0"
                type="fading-circle"></mt-spinner>
    </p>
  </div>
</template>

<script>
var lesson = {
  poster: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
  title: '标题一',
  desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。'
}

export default {
  name: 'LessonListPage',
  data() {
    return {
      title: '认知英语学习',
      lessonList: [],
      loadStatus: 1, // 0:loading; 1: loaded; 2:completed
      count: 0
    }
  },
  computed: {
    disableInfiniteScroll: function() {
      return this.loadStatus === 0 || this.loadStatus === 2
    }
  },
  methods: {
    loadMore() {
      if (this.loadStatus === 2) {
        return
      }

      this.loadStatus = 0
      setTimeout(() => {
        for (let i = this.count; i < this.count + 10; i++) {
          let newObj = { ...lesson }
          newObj.title = '标题' + (i + 1)
          this.lessonList.push(newObj)
        }
        this.count += 10
        if (this.count < 50) {
          this.loadStatus = 1
        } else {
          this.loadStatus = 2
        }
      }, 2000)
    }
  }
}

</script>

<style>
.mint-cell {
  min-height: 60px;
}

.mint-cell-text {
  margin-left: 3px;
}
</style>
