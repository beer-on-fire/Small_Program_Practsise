// pages/history/index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    loading:true,
    total:0,
    score:0,
    average:0
  },

  onLoad (options) {
    var objectId = options.id
    util.request(api.GetHistory, { uid: 'xxx', id: objectId }).then(res=>{
     util.request(api.GetBeatNum, { uid: 'xxx', id: res.result.menu, score: res.result.score }).then(res1=>{
       util.request(api.GetAverage, { uid: 'xxx', id: res.result.menu }).then(res2 => {
          this.setData({
            objectId:objectId,
            loading: false,
            total: res.result.questionList.length,
            score: res.result.score,
            questions: res.result.questionList,
            beatNum: res1.result,
            average: parseInt(res2.result[0].allScore / res2.result[0].peopleNum)
          })
        })
      }) 
    })
  },
  back(){
    wx.reLaunch({
      url: '/pages/select/index',
    })
  },
  analysis(){
    wx.navigateTo({
      url: '/pages/analysis/index?objectId='+ this.data.objectId,
    })
  }
})