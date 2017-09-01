<template>
  <div>
    <cogen-header :url="seriesUrl" :title="series.title">
      <a slot="left" @click="$router.go(-1)">返回</a>
    </cogen-header>
    <div class="section">
      <h4 class="title is-4">个人信息</h4>
      <div class="columns is-mobile">
        <div class="column is-4">头像</div>
        <div class="column">
          <figure class="image is-64x64">
            <img :src="user.avatar">
          </figure>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">昵称</div>
        <div class="column">{{user.nickname || user.username}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">性别</div>
        <div class="column">{{userSex}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">手机号码</div>
        <div class="column">{{user.phoneNo}}</div>
      </div>
    </div>
    <hr>
    <div class="section">
      <h4 class="title is-4">商品信息</h4>
      <div class="columns is-mobile">
        <div class="column is-4">名称</div>
        <div class="column">{{series.title}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">价格</div>
        <div class="column">￥{{series.price}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">有效期</div>
        <div class="column"></div>
      </div>
    </div>
    <div class="footer">
      <div class="columns is-mobile">
        <div class="column">
          <a class=" button is-primary is-fullwidth" @click="startWxPay">付款</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CogenHeader from '../components/CogenHeader'
import wx from '../wechat'

export default {
  name: 'Payment',
  props: {
    seriesId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: this.$auth.user()
    }
  },
  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    },
    series () {
      return this.$store.state.series
    },
    userSex () {
      switch (this.user.sex) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return '未知'
      }
    }
  },
  mounted () {
    let seriesId = this.seriesId
    this.$store.dispatch('getSeries', seriesId).then((series) => {
    }).catch((error) => {
      console.error(error)
      this.series = { title: '课程不存在' }
    })
  },
  methods: {
    startWxPay () {
      this.$store.dispatch('getSeriesPayParams', {seriesId: this.seriesId}).then((payparams) => {
        wx.pay(payparams)
      })
    }
  },
  components: {
    CogenHeader
  }
}
</script>

<style>

</style>

