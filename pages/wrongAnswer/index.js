// pages/wrongAnswer/index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
  data: {
    id:'',//错题id
    loading:true,
    questionInfo:{},
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    showAnswer:false,
    index:0,
    total:0
  },

  onLoad: function (options) {
    var menu = options.menu
    util.request(api.GetError, { level_id: menu }).then(res=>{
      let result = JSON.parse(res.result)
      this.setData({
        id: options.menu,
        result: result,
        loading:false,
        total: result.length,
      })
      this.setThisData(0)
    })
  },
  showAnswer(){
    this.setData({
      showAnswer:true
    })
  },
  //翻页
  handlePageChange({ detail }){
    const action = detail.type;
    const r = this.data.result

    if (action === 'next') {
      if (this.data.index >= (r.length - 1)) {
        return;
      }
      this.setThisData((this.data.index + 1));
      this.setData({
        showAnswer: false,
        index: (this.data.index + 1),
      })
    } else {
      this.setThisData((this.data.index - 1));
      this.setData({
        showAnswer: false,
        index: (this.data.index - 1),
      })
    }
  },
  setThisData(i) {
    const r = this.data.result
    var current = "";
    var currentD = [];
    this.setData({
      current: current,
      currentD: currentD,
      questionInfo: r[i],
    })
  },
  //弹出统计下拉层
  handleOpen() {
    this.setData({
      actionVisible: true
    })
  },
  //关闭统计下拉层
  actionCancel() {
    this.setData({
      actionVisible: false
    })
  },
  dump(e) {
    var index = e.currentTarget.dataset.index
    this.setThisData(index)
    this.setData({
      index: index,
      actionVisible: false
    })
  },
  deleteError(){
    this.data.result.splice(this.data.index, 1);
    util.request(api.DeleteError, { uid: 'xxx', level_id: this.data.id, list:this.data.result })
    this.setData({
      result: this.data.result,
      total: this.data.result.length,
      actionVisible: false
    })
    this.setThisData(this.data.index)
  }
})