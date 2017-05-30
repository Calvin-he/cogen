<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <div class="tile is-child">
          <a class="button is-primary" title="新增课程" @click="toggleDetails(newSeries)">
            新增系列&nbsp;
            <span v-show="!expanded[0]">
              <i class="fa fa-angle-right fa-2x"></i>
            </span>
            <span v-show="expanded[0]">
              <i class="fa fa-angle-down fa-2x"></i>
            </span>
          </a>
          <div class="box" v-show="expanded[0]">
            <series-editor :series="newSeries"></series-editor>
          </div>
        </div>
        <article class="tile is-child box">
          <table class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>标题</th>
                <th>课程数</th>
                <th>更新时间</th>
                <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tfoot>
            </tfoot>
            <tbody>
              <template v-for="(series, index) in seriesList">
                <tr>
                  <td>{{index+1}}</td>
                  <td>{{series.title}}</td>
                  <td>{{series.lessonList.length}}</td>
                  <td>{{series.updated | date}}</td>
                  <td>
                    <a class="button" v-show="!expanded[series._id]" @click="toggleDetails(series)">
                      展开&nbsp;<i class="fa fa-angle-right fa-2x"></i>&nbsp;
                    </a>
                    <a class="button is-primary" v-show="expanded[series._id]" @click="toggleDetails(series)">
                      隐藏&nbsp;<i class="fa fa-angle-down fa-2x"></i>
                    </a>
                  </td>
                </tr>
                <tr v-if="expanded[series._id]">
                  <td colspan="5">
                    <series-editor :series="series"></series-editor>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import SeriesEditor from './SeriesEditor.vue'

export default {
  data () {
    return {
      expanded: { 0: true },
      newSeries: {
        title: null,
        desc: null,
        bannerId: null,
        lessonList: []
      }
    }
  },
  computed: {
    seriesList () {
      return this.$store.state.lesson.seriesList
    }
  },
  mounted () {
    this.$store.dispatch('listSeries')
  },
  methods: {
    toggleDetails (series) {
      let lid = series._id
      if (lid) {
        this.$set(this.expanded, lid, !this.expanded[lid])
      } else {
        this.$set(this.expanded, 0, !this.expanded[0])
      }
    }
  },
  components: {
    SeriesEditor
  }
}
</script>
