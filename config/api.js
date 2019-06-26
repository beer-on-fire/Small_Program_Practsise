const ApiRootUrl = 'http://39.98.170.38/api.php/demo/';

module.exports = {
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口
  ColumnList: ApiRootUrl + 'question/columns',  // 题目分类目录
  ColumnInfo: ApiRootUrl + 'question/columnInfo',  //分类目录当前分类数据接口
  GetQuestions: ApiRootUrl + 'question/questions',// 题目列表
  GetSetting: ApiRootUrl + 'question/getSetting',
  AddHistory: ApiRootUrl + 'question/addHistory', // 添加到历史
  AddError: ApiRootUrl + 'question/addError', // 添加到错题
  GetStatistics: ApiRootUrl + 'question/getStatistics', // 获取统计分数
  Statistics: ApiRootUrl + 'question/statistics', // 获取统计分数
  GetError: ApiRootUrl + 'question/getError', // 获取当前分类下错题
  DeleteError:  ApiRootUrl + 'question/deleteError', // 移除错题
  GetRank: ApiRootUrl + 'question/getRank', // 获取当前分类下排名
  GetHistoryList: ApiRootUrl + 'question/getHistoryList', // 获取测试历史纪录列表
  GetHistory: ApiRootUrl + 'question/getHistory', // 获取测试历史纪录
  GetBeatNum: ApiRootUrl + 'question/getBeatNum', // 打败多少人
  GetAverage: ApiRootUrl + 'question/getAverage', // 平均分
  AddFeedBack: ApiRootUrl + 'question/addFeedBack', // 反馈
};