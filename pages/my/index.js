// pages/my/index.js
Page({
  data: {
    userInfo:{}
  },
  onLoad (options) {
    var that = this
    wx.getUserInfo({
      success(res) {
        that.setData({
          userInfo:res.userInfo
        })
      }
    })
  },
  onShareAppMessage(){
    return {
      title: '答题酷',
      path: '/pages/index/index',
      imageUrl:'/images/logo.png'
    }
  },
  about() {
    wx.showModal({
      title: '关于',
      content: 'Life Is Fantastic',
      showCancel: false
    })
  }
})