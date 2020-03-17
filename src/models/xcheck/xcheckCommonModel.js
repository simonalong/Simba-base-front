import {
  dictionaryQuery
} from '@/services/xcheck/xcheckCommonApi';

export default {
  namespace: 'xcheckCommonModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    xcheckGroupDict: [],
    xcheckDuplexDict: [],
    xcheckStatusDict: [],
    balanceActionDict: [],
    diffHandleWayDict: [],

    xcheckBillTypeDict: [],

    taskStatusDict: [],

    diffStatusDict: [],
    diffHandledDict: [],

    nodeStatusDict: [],
  },

  // 异步处理函数
  effects: {

    // 获取业务列表
    *dictionaryQuery({payload}, {call, put}) {
      // console.log('dictionaryQuery 参数：');
      const response = yield call(dictionaryQuery, payload);
      // console.log(JSON.stringify(response));

      yield put({
        type: 'handleDictionaryQuery',
        payload: {
          response,
        }
      });
    },
  },

  reducers: {

    handleDictionaryQuery(state, action){
      return {
        ...state,
        xcheckGroupDict: action.payload.response.data.xcheckGroup,
        xcheckDuplexDict: action.payload.response.data.xcheckDuplex,
        xcheckStatusDict: action.payload.response.data.xcheckStatus,
        balanceActionDict: action.payload.response.data.balanceAction,
        diffHandleWayDict: action.payload.response.data.diffHandleWay,

        xcheckBillTypeDict: action.payload.response.data.xcheckBillType,

        taskStatusDict: action.payload.response.data.taskStatus,

        diffStatusDict: action.payload.response.data.diffStatus,
        diffHandledDict: action.payload.response.data.diffHandled,

        nodeStatusDict: action.payload.response.data.nodeStatus,
      };
    }

  },
};
