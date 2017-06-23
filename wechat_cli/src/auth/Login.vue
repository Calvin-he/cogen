<template>
  <div>
    登录中...</div>
</template>

<script>
const AppId = 'wx102d66d53d18931f'

export default {
  mounted () {
    // console.log('user', this.$auth.user)
    let redirect = this.$auth.redirect()
    if (redirect) {
      if (redirect.from.query.code == null) {
        let fullPath = encodeURIComponent(location.protocol + '//' + location.hostname + redirect.from.fullPath)
        let wechatUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${AppId}&redirect_uri=${fullPath}&response_type=code&scope=snsapi_base&state=Rzyyxx#wechat_redirect`
        window.location.href = wechatUrl
      } else {
        this.$auth.login({
          params: { code: redirect.from.query.code, state: redirect.from.query.state, origin: 'wechat', appid: AppId },
          rememberMe: true,
          redirect: { name: redirect.from.name },
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
    }
  }
}
</script>

<style>

</style>
