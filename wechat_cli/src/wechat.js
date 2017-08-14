import wx from 'weixin-js-sdk'

var api = {
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
  }
}

export default api
