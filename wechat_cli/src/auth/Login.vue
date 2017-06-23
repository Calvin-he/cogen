<template>
  <div v-if="isWechatBrowser()">
    微信登录中...
  </div>
  <div class="box" v-else>
    <h1 class="title is-4 has-text-centered">用户登录</h1>
    <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
    <form v-on:submit.prevent="loginByUsername">
      <div class="field is-horizontal is-mobile">
        <div class="field-label is-normal">
          <label class="label">用户名</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input v-model="username" class="input" type="text" placeholder="">
            </div>
          </div>
        </div>
      </div>
  
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">密码</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input v-model="password" class="input" type="password" placeholder="">
            </div>
          </div>
        </div>
      </div>
  
      <div class="field">
      <p class="control">
        <label class="checkbox">
          <input type="checkbox" v-model="rememberMe"> Remember me
        </label>
      </p>
      </div>
  
      <hr>
      <p class="control">
        <button type="submit" class="button is-primary is-fullwidth" :class="{'is-loading': logging}">登录</button>
      </p>
    </form>
  </div>
</template>

<script>
const AppId = 'wx102d66d53d18931f'

export default {
  data () {
    return {
      username: '',
      password: '',
      rememberMe: false,
      error: null,
      logging: false
    }
  },

  mounted () {
    // console.log('user', this.$auth.user)
    let redirect = this.$auth.redirect()
    if (redirect && this.isWechatBrowser()) {
      this.loginWechat()
    }
  },
  methods: {
    isWechatBrowser () {
      let ua = navigator.userAgent.toLowerCase()
      return (/micromessenger/.test(ua))
    },

    loginWechat () {
      let from = this.$auth.redirect().from
      if (from.query.code == null) {
        this.$store.dispatch('getAppId').then((appId) => {
          let fullPath = encodeURIComponent(location.protocol + '//' + location.hostname + from.fullPath)
          let wechatUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${fullPath}&response_type=code&scope=snsapi_base&state=Rzyyxx#wechat_redirect`
          window.location.href = wechatUrl
        })
      } else {
        this.$auth.login({
          params: { code: from.query.code, state: from.query.state, origin: 'wechat', appid: AppId },
          rememberMe: true,
          redirect: { name: from.name },
          success (res) {
            console.log('Auth Success')
            this.$auth.user(res.user)
          },
          error (err) {
            console.log('err: ', err)
            if (err.response) {
              this.error = err.response.data
            } else {
              console.log('Error', err.message)
            }
          }
        })
      }
    },

    loginByUsername () {
      if (!this.username || !this.password) {
        this.error = '用户名或密码不能为空'
        return
      }
      let redirectPath = this.$auth.redirect() ? this.$auth.redirect().from.fullPath : '/'
      this.logging = true
      this.$auth.login({
        params: { username: this.username, password: this.password, origin: 'cogen', appid: AppId },
        rememberMe: this.rememberMe,
        redirect: { path: redirectPath },
        success (res) {
          console.log('Auth Success')
          this.$auth.user(res.user)
          this.logging = false
        },
        error (err) {
          console.log('err: ', err)
          if (err.response) {
            this.error = err.response.data
          } else {
            console.log('Error', err.message)
          }
          this.logging = false
        }
      })
    }
  }
}
</script>

<style>

</style>
