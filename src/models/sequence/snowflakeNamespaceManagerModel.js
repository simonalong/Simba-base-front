import {
  workerNodePageList,
  workerNodeCount,
  add,
  deleteData,
  update,
  nameExist,
  getManagerInfo
} from '@/services/sequence/snowflakeNamespaceApi';

import {
  forceGiveBack
} from '@/services/sequence/snowflakeToolApi';


export default {
  namespace: 'snowflakeNamespaceManagerModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    // 数据
    tableList: [],
    tableLoading: false,
    searchParam: {},
    totalNumber: 0,
    pager: {
      pageNo: 1,
      pageSize: 20,
    },

    watcherInfo:{}, // 命名空间的监控信息
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    // eslint-disable-next-line no-unused-vars
    *tableFresh({payload}, { put }) {
      // console.log('snowflakeNamespaceModel.tableFresh 参数：');
      // console.log(JSON.stringify(payload));
      yield put({
        type: 'pageCount',
        payload: {
          searchParam:{
            namespace:payload.searchParam
          }
        },
      });

      yield put({
        type: 'pageList',
        payload: {
          pager: {
            pageNo: 1,
            pageSize: 20,
          },
          searchParam:{
            namespace:payload.searchParam
          }
        },
      });
    },

    // // 增加组配置
    // *add({ payload }, { call, put }) {
    //   // console.log('snowflakeNamespaceModel.add 参数：');
    //   // console.log(JSON.stringify(payload));
    //   const response = yield call(add, payload);
    //   yield put({
    //     type: 'handleAddResult',
    //     payload: response,
    //   });
    //
    //   // 调用界面刷新
    //   yield put({
    //     type: 'tableFresh',
    //   });
    // },

    // 删除组配置
    *forceGiveBack({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.delete 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(forceGiveBack, payload);
      yield put({
        type: 'handleForceGiveBackResult',
        payload: {
          response,
          namespace: payload.namespace,
        },
      });

      // 添加调用界面刷新
      yield put({
        type: 'tableFresh',
        payload:{
          searchParam: payload.namespace
        }
      });

      // 清理监控信息
      yield put({
        type: 'clearNamespaceWatcherInfo'
      });

      // 获取监控新的信息
      yield put({
        type: 'getNamespaceWatcherInfo',
        payload
      });
    },

    // // 修改组配置
    // *update({ payload }, { call, put }) {
    //   // console.log('snowflakeNamespaceModel.update 参数：');
    //   // console.log(JSON.stringify(payload));
    //   const response = yield call(update, payload);
    //   yield put({
    //     type: 'handleUpdateResult',
    //     payload: {
    //       response,
    //       param: payload,
    //     },
    //   });
    //
    //   // 调用界面刷新
    //   yield put({
    //     type: 'tableFresh',
    //   });
    // },

    // 获取配置列表
    *pageList({ payload }, { call, put }) {
      console.log('snowflakeNamespaceModel.pageList 参数：');
      console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      console.log(JSON.stringify(values));
      const response = yield call(workerNodePageList, values);
      // console.log('snowflakeNamespaceModel.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.pageCount 参数：');
      // console.log(JSON.stringify(payload));

      const params =
        payload === undefined || payload.searchParam === undefined ? {} : payload.searchParam;
      const pager = payload === undefined || payload.pager === undefined ? {} : payload.pager;
      const values = {
        ...params,
        ...pager,
      };

      // console.log(JSON.stringify(values));
      const response = yield call(workerNodeCount, values);
      yield put({
        type: 'handleCountResult',
        payload: {
          response,
        },
      });
    },

    // 命名空间是否存在
    *nameValueCheck({payload, callback}, {call}) {
      console.log('snowflakeNamespaceModel.nameValueCheck 参数：');
      console.log(JSON.stringify(payload));

      if (payload !== "") {
        const response = yield call(nameExist, payload);
        console.log('snowflakeNamespaceModel.nameValueCheck 结果：');
        console.log(JSON.stringify(response));
        if (response.data === 1) {
          callback("当前命名空间已经存在");
        } else {
          callback();
        }
      }
    },

    // 获取命名空间的监控信息
    *getNamespaceWatcherInfo({payload}, {call, put}) {
      console.log('snowflakeNamespaceModel.getManagerInfo 参数：');
      console.log(JSON.stringify(payload));
      const response = yield call(getManagerInfo, payload);
      console.log('snowflakeNamespaceModel.getManagerInfo 结果：');
      console.log(JSON.stringify(response));
      yield put({
        type: 'handleNamespaceWatcherInfo',
        payload: {
          response,
        },
      });
    }
  },

  reducers: {
    setSearchParam(state, action) {
      return {
        ...state,
        searchParam: action,
      };
    },

    setTableLoading(state) {
      return {
        ...state,
        tableLoading: true,
      };
    },

    handleCountResult(state, action) {
      // console.log('snowflakeNamespaceModel.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      // console.log('snowflakeNamespaceModel.handlePageListResult 返回的结果');
      // console.log(JSON.stringify(action));

      const pl = action.payload;

      return {
        ...state,
        pager:{
          ...pl.pager,
          pageNo:pl.pager.pageNo
        },
        tableList: pl.response.data,
        searchParam: pl.searchParam,
        tableLoading: false
      };
    },

    handleAddResult(state) {
      return {
        ...state,
      };
    },

    handleUpdateResult(state, action) {
      // console.log('snowflakeNamespaceModel.handleUpdateResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      // 若成功，则不不需要重新加载后端，而是直接修改前段的内存数据
      const {tableList} = state;
      if (action.payload.response === 1) {
        const newItem = action.payload.param;
        const dataIndex = tableList.findIndex(item => newItem.id === item.id);
        if (dataIndex > -1) {
          tableList.splice(dataIndex, 1, {
            ...tableList[dataIndex],
            ...newItem,
          });
        }
      }

      return {
        ...state,
        tableList,
        tableLoading: false
      };
    },

    handleForceGiveBackResult(state) {
      // console.log('snowflakeNamespaceModel.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      return {
        ...state,
      };
    },

    clearNamespaceWatcherInfo(state, action){
      console.log('snowflakeNamespaceModel.clearNamespaceWatcherInfo 返回的结果');
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        watcherInfo: {}
      }
    },

    handleNamespaceWatcherInfo(state, action){
      console.log('snowflakeNamespaceModel.handleNamespaceWatcherInfo 返回的结果');
      console.log(JSON.stringify(action.payload));
      return {
        ...state,
        watcherInfo: action.payload.response.data
      }
    }
  },
};
