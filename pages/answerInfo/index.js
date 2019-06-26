const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    id: '',
    time: '',
    questionMenu: '',
    questionNum: ''
  },
  onLoad(e) {
    var id = e.id
    var questionMenu = e.questionMenu
    var time, questionNum
    //获取套题start
    util.request(api.ColumnInfo, {
      uid: 'xxx',
      level_id: id
    }).then(res => {
      this.setData({
        id,
        questionMenu,
        questionNum: res.result.question_num,
        time: res.result.question_time
      });
    });
  },
  start() {
    wx.redirectTo({
      url: '/pages/answer/index?id=' + this.data.id + '&questionMenu=' + this.data.questionMenu
    })

  },
})