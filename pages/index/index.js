// pages/start/index.js
const app = getApp();
let globalUserInfo = app.globalData.userInfo
Page({
  data: {
    userInfo: {},
    isUserInfo:false
  },
  onLoad(e) {
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        globalUserInfo = res.data
        _this.setData({
          userInfo: res.data
        })
      },
    })
  },
  bindgetuserinfo(res) {
    let userDetail = res.detail.userInfo
    if(userDetail !== undefined) {
      wx.setStorageSync('userInfo', userDetail)
      globalUserInfo = userDetail
      this.setData({
        userInfo: userDetail
      })
    }
  },
  goSign() {
    wx.reLaunch({
      url: '/pages/select/index',
    })
  }
})