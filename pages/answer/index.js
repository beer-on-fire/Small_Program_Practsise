// pages/answer/index.js
import { $wuxCountDown } from '../../wux/index'
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index')

const util = require('../../utils/util.js');
const api = require('../../config/api.js');
 
Page({
  data: {
    loading: true, //加载中
    result: {}, //题目
    total: 0, //题目总总数
    menu:'',//套题id
    percent: 0, //进度条百分比
    time: 45, //时间
    Countdown: '', //倒计时
    s: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '],
    index: 1, //第几题
    current: '', //单选选中的答案
    currentD: [], //多选选中的答案
    type: '', //题目类型 1:单选 2:多选
    disabled: false, //单选选中不可选
    disabled1: false, //多选选中不可选
    actionVisible: false, //弹出层
    questionErr: 0,//错题个数
    questionOk: 0,// 正确个数
    questionInfo: null, // 当前题目信息
    percentage: 0,
    visible1:false,
    visible2:false,
    action1:[
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
    action2:[
      {
        name: '确定',
        color: '#2db7f5',
        loading: false
      }
    ],
    // 录音
    recordColor: "info",
    recordDisabled: false,
    isStartRecord: false,
    upRecordDisabled: true,
    recordTime: 0,
    allTiming: 60,
  },

  onLoad(e) {
    var that = this;
    //获取题目
    util.request(api.GetQuestions, { uid: 'xxx', level_id:e.id}).then(res => {
        this.setData({
          loading:false,
          result: res.result,
          total: res.result.length,
          menu:e.id,
          questionMenu: e.questionMenu
        })
        //倒计时
        var Countdown = new $wuxCountDown({
          date: +(new Date) + 60000 * parseInt(that.data.time),
          render(date) {
            const min = this.leadingZeros(date.min, 2) + ':'
            const sec = this.leadingZeros(date.sec, 2) + ''
            //答题时间结束
            if (date.min === 0 && date.sec === 0) {
              that.handleClick1();
            }
            this.setData({
              Countdown: min + sec,
            })
          }
        })

        this.setThisData(0)
      })
    
  },
  //设置当前题目
  setThisData(i) {
    const r = this.data.result
    const that = this;
    if (r.length == 0) {
      wx.redirectTo({
        url: '/pages/answerErr/index',
      })
      return
    }

    const answer = [];
    let choseList = r[i].choseList // 当前题目的选项
    //获取正确答案
    for (var j = 0; j < choseList.length; j++) {
      if (choseList[j].isChose) {
        answer.push(choseList[j].item);
      }
    }
    this.setData({
      questionInfo: r[i],
      answer: answer,
      type: r[i].type
    })
  },
  //统计答题
  statistical() {
    if ((this.data.questionErr + this.data.questionOk) == this.data.result.length){
      return
    }
    //记录选择的答案
    if (this.data.type == 1) {
      //单选
      var choose = this.data.current;
      this.data.result[this.data.index - 1].choose = [choose];
    } else {
      //多选
      var choose = this.data.currentD;
      this.data.result[this.data.index - 1].choose = [choose];
    }
    let questionErr = this.data.questionErr  //错题个数
    let questionOk = this.data.questionOk  //错题个数
    let questionInfo = this.data.questionInfo
    let result = this.data.result
    let index = this.data.index
    if (questionInfo.isOk === 1) {
      questionOk = questionOk + 1
      result[index - 1].judge = 1
    } else {
      questionErr = questionErr + 1
      result[index - 1].judge = 0
    }
    //计算百分比
    let percentage = questionOk / (index) * 100
    percentage = percentage.toFixed(2)

    //进度条
    let percent = this.data.index / this.data.total
    percent = (percent * 100).toFixed(2);
    percent = percent < 1 ? 1 : percent

    this.setData({
      result: result,
      questionOk: questionOk,
      questionErr: questionErr,
      percentage: percentage,
      percent: percent
    })
  },
  //单选
  handleChange({detail = {},target = {}}) {
    let questionInfo = this.data.questionInfo
    //判断答案
    if (target.dataset.id) {
      questionInfo.isOk = 1
    } else {
      questionInfo.isOk = 0
    }

    this.setData({
      questionInfo: questionInfo,
      current: detail.value
    });
  },
  //多选
  handleChangeD({detail = {},target = {}}) {
    let questionInfo = this.data.questionInfo
    const index = this.data.currentD.indexOf(detail.value);
    index === -1 ? this.data.currentD.push(detail.value) : this.data.currentD.splice(index, 1);
    this.setData({
      currentD: this.data.currentD,
    });
    var answer = this.data.answer;
    var currentD = this.data.currentD;
    var rightNum = 0;
    for (var i = 0; i < currentD.length; i++) {
      var indexs = currentD[i].indexOf(" ");
      var indexOf = answer.indexOf(currentD[i].substring(indexs + 1));
      console.log(indexOf)
      if(indexOf >= 0){
        rightNum += 1;
      }
    }
    //判断答案
    if(rightNum == answer.length){
      questionInfo.isOk = 1
    }else{
      questionInfo.isOk = 0
    }
    this.setData({
      questionInfo : questionInfo
    })

  },
  //翻页
  handlePageChange({ detail }) {
    const action = detail.type;
    const r = this.data.result;

    //上下一题
    if (action === 'next') {
      const i = this.data.index;
      const type = this.data.type;
      if (i == r.length) {
        this.statistical()
        
        $Message({
          content: '题目已答完,请交卷',
          duration: 3,
          type: 'warning'
        });
        return;
      }
      if (r[i].type == 1 ) {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      } else {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      }
      //单选
      if (type == '1') {
        const current = this.data.current;
        if (current == "") {
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      } else {
        const length = this.data.currentD.length;
        if (length == 0){
          wx.showToast({
            title: '请选择答案',
            duration: 1500,
            image: '/images/warning.png'
          })
          return;
        }
      }
      if (choose == undefined && (this.data.disabled == false || this.data.disabled1 == false )) {
        this.statistical()
      }
      this.setThisData(this.data.index);
      this.setData({
        index: this.data.index + 1,
        current: choose == undefined ? '' : choose,
        currentD: choose == undefined ? []: choose,
        disabled: choose == undefined ? false : true,
        disabled1: choose == undefined ? false : true
      });
    } else if (action === 'prev') {
      var i = this.data.index - 2;
      if (r[i].type == '1') {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }

      } else {
        if (r[i].choose) {
          var choose = r[i].choose[0];
        }
      }
      this.setThisData(this.data.index - 2);
      this.setData({
        index: this.data.index - 1,
        current: choose,
        currentD: choose,
        disabled: true,
        disabled1:true
      });
    }
  },
  //交卷处理
  submit(){
    this.setData({
      loading:true,
      visible1:false
    })
    let _this = this
    var result = this.data.result
    var score = this.data.questionOk
    var menu = this.data.menu
    var questionMenu = this.data.questionMenu
    util.request(api.AddHistory, { uid: 'xxx', level_id:menu, score, result, question_menu:questionMenu }).then(res=>{
      this.setData({
        loading: false,
      })
      if(res.result){
        wx.reLaunch({
          url: '../history/index?id='+res.result
        })
      }  
    })
    var err = [];
    for(let object of result){
      if(object.judge ==0 || object.judge == undefined){
        err.push(object)
      }
    }

    //添加错题
    util.request(api.AddError, { uid: 'xxx', level_id: menu, result: err, question_menu:questionMenu }).then(res=>{})
    //统计分数
    util.request(api.GetStatistics, { uid: 'xxx', level_id: menu }).then(res=>{
      util.request(api.Statistics, { uid: 'xxx', id: res.result.objectId, addScore: this.data.questionOk }).then((res1)=>{
        if (res1.code===1) {
          wx.navigateTo({
            url: `/pages/history/index?id=${_this.data.menu}`,
          })
        }
      })
    })
  },
  //交卷对话框
  handleSubmitOpen(){
    this.setData({
      visible1:true
    })
  },
  //交卷按钮
  checkSubmit({ detail }){
    //取消
    if (detail.index === 0) {
      this.setData({
        visible1: false
      });
    } else{
      //交卷
      this.submit();
    }
  },
  handleSubmit(){
    this.submit();
  },
  //时间到对话框
  handleClick1(){
    this.setData({
      visible2: true
    });
  },
  //弹出统计下拉层
  handleOpen(){
    this.setData({
      actionVisible:true
    })
  },
  //关闭统计下拉层
  actionCancel(){
    this.setData({
      actionVisible:false
    })
  },

  // 录音
  startRecord(e) {
    console.log(this.data.isStartRecord)

    if (this.data.recordDisabled) return

    var recorderManager = wx.getRecorderManager();
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    recorderManager.start(options)
    recorderManager.onStart(() => {
      this.setData({
        recordColor: "success",
        isStartRecord: true
      })
      $Toast({
        content: `最长录制${this.data.allTiming}秒`
      })
    });
    recorderManager.onError((res) => {
      this.setData({
        recordColor: "error"
      })
      $Toast({
        content: '回答失败'
      })
    })

    clearInterval(this.timer)
    let times = 0
    this.timer = setInterval(()=>{
      times++
      this.setData({recordTime: times})
      if (times >= this.data.allTiming) {
        this.stopRecord()
      }
    }, 1000)
  },
  stopRecord(){
    if (this.data.recordDisabled) return
    var recorderManager = wx.getRecorderManager(); //获取全局唯一的录音管理器
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      const { tempFilePath } = res
      // todo - wx.uploadFile({})
      this.setData({
        isStartRecord: false,
        recordDisabled: true,
        upRecordDisabled: false
      })
      $Toast({
        content: '已停止'
      })
    })
    
  },

  answerToServer: function (e) {
    
  }
})