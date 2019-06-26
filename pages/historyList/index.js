// pages/historyList/index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    dataInfo:{},
    nodata:false,
    loading:true
  },
  onLoad (options) {
    util.request(api.ColumnList, { uid: 'xxx' }).then(res=>{
      if(res.result){
        // for(let object of res.data){
        //   object.createdAt = object.createdAt.split(" ")[0]
        // }
        this.setData({
          dataInfo:res.result,
          nodata: false,
          loading:false
        })
      }else{
        this.setData({
          nodata:true,
          loading:false
        })
      }
    })
  }
})