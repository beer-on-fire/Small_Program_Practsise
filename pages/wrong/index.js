// pages/wrong/index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    selectQuestionMenu: '请选择',
    objectQuestionMenu: {},
    questionMenu: [],
    index: 0,
  },
  onLoad (options) {
    //获取套题
    util.request(api.ColumnList, {uid:'xxx'}).then(res => {
      var questionMenu = [];
      if (res.result.length > 0) {
        for (var i = 0; i < res.result.length; i++) {
          questionMenu.push(res.result[i].column_name);
        }
        this.setData({
          questionMenu,
          objectQuestionMenu: res.result
        });
      }
    })
  },
  /**
   * 选择题库
   */
  changeMenu(e) {
    this.setData({
      index: e.detail.value,
      selectQuestionMenu: this.data.questionMenu[e.detail.value]
    })
    var objectQuestionMenu = this.data.objectQuestionMenu
    var menu = objectQuestionMenu[e.detail.value].id
    util.request(api.GetError, { level_id:menu }).then(res=>{
      if (res.result){
        wx.navigateTo({
          url: '/pages/wrongAnswer/index?menu='+menu,
        })
      }else{
        wx.showToast({
          title: '无错题记录',
          duration: 1500,
          image: '/images/warning.png'
        })
        return;
      }
    })
  },
})