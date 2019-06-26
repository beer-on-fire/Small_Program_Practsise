const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    selectQuestionMenu: '请选择',
    objectQuestionMenu: {},
    questionMenu: [],
    index: 0
  },
  onLoad(options) {
    //获取套题
    util.request(api.ColumnList, {}).then(res => {
      var questionMenu = [];
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          questionMenu.push(res.data[i].column_name);
        }
        this.setData({
          questionMenu,
          objectQuestionMenu: res.data
        });
      }
    })
  },
  /**
   * 选择题库
   */
  changeMenu(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      selectQuestionMenu: this.data.questionMenu[e.detail.value]
    })
    var objectQuestionMenu = this.data.objectQuestionMenu
    var menu = objectQuestionMenu[e.detail.value].objectId
    util.request(api.GetRank, { menu }).then(res=>{
      if(res.result){
        wx.navigateTo({
          url: '/pages/rankList/index?menu=' + menu,
        })
      }else{
        wx.showToast({
          title: '暂无记录',
          duration: 1500,
          image: '/images/warning.png'
        })
        return;
      }
    })
  },
})