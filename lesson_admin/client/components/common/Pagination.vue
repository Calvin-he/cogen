<template>
  <nav class="pagination is-centered is-large" role="navigation" aria-label="pagination" style="width:100%">
    <a class="pagination-previous" @click="gotoPage(curPage-1)">Previous</a>
    <a class="pagination-next" @click="gotoPage(curPage+1)">Next page</a>
    <ul class="pagination-list">
      <li>
        <a class="pagination-link" v-show="curPage>3" @click="gotoPage(1)">1</a>
      </li>
      <li>
        <span class="pagination-ellipsis" v-show="curPage>3">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" v-show="curPage>2" @click="gotoPage(curPage-2)">{{curPage-2}}</a>
      </li>
      <li>
        <a class="pagination-link" v-show="curPage>1" @click="gotoPage(curPage-1)">{{curPage-1}}</a>
      </li>
      <li>
        <a class="pagination-link is-current" @click="gotoPage(curPage)">{{curPage}}</a>
      </li>
      <li>
        <a class="pagination-link" v-show="curPage+1<=maxPageNum" @click="gotoPage(curPage+1)">{{curPage+1}}</a>
      </li>
      <li>
        <a class="pagination-link" v-show="curPage+2<=maxPageNum" @click="gotoPage(curPage+2)">{{curPage+2}}</a>
      </li>
      <li>
        <span class="pagination-ellipsis" v-show="curPage+3<maxPageNum">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" v-show="curPage+3<maxPageNum" @click="gotoPage(maxPageNum)">{{maxPageNum}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  data () {
    return {
      curPage: 1,
      maxPageNum: Math.ceil(this.totalNum / this.pageSize)
    }
  },
  props: {
    totalNum: Number,
    pageSize: {
      type: Number,
      default: 10
    }
  },

  methods: {
    gotoPage (pageNum) {
      if (pageNum >= 1 && pageNum <= this.maxPageNum) {
        this.$emit('goto-page', pageNum)
        this.curPage = pageNum
      }
    }
  }
}
</script>

<style>

</style>
