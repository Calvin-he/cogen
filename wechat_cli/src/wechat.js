import wx from 'weixin-js-sdk'
import Vue from 'vue'

var api = {
  config () {
    Vue.axios.post('/wechat/config', {
      debug: false,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay'],
      url: window.location.href
    }).then(res => {
      wx.config(res.data.params)
      wx.error(res => {
        console.log(res)
      })
    })
  },

  wxShare ({title, desc}) {
    let path = window.location.pathname.endsWith('/') ? window.location.pathname : (window.location.pathname + '/')
    let imgUrl = window.location.origin + path + 'static/cognitiven.jpg'
    let link = window.location.href
    wx.ready(function () {
      wx.onMenuShareAppMessage({
        title: title || document.title,
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          console.log('Succeed to share to friend.')
        },
        cancel: () => {
          console.log('Fail to share to friend!')
        }
      })

      wx.onMenuShareTimeline({
        title: title || document.title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
        },
        cancel: function () {
        }
      })
    })
  },

  pay (payparams) {
    /* eslint-disable-next-line
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', JSON.stringify(payparams), function (res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          alert('paid successfully')
        } else {
          alert(res.err_msg + ': ' + JSON.stringify(payparams))
        }
      }) */
    wx.chooseWXPay({
      timestamp: payparams.timeStamp,
      nonceStr: payparams.nonceStr,
      package: payparams['package'],
      signType: payparams.signType,
      paySign: payparams.paySign,
      success: (res) => {
        alert(res)
      },
      fail: (err) => {
        alert(JSON.stringify(err) + ': ' + JSON.stringify(payparams))
      }
    })
  }
}

export default api
