// pages/historyList/index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    dataInfo: {},
    nodata: false,
    loading: true,
  },
  onLoad(options) {
    util.request(api.ColumnList, { uid: 'xxx', pid: 0 }).then(res => {
      if (res.result) {
        this.setData({
          dataInfo: res.result,
          nodata: false,
          loading: false
        })
      } else {
        this.setData({
          nodata: true,
          loading: false
        })
      }
    })
  }
})