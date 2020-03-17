import { notification, message } from 'antd';
import {
  pageList,
  add,
  deleteData,
  update,
  nameExist,
  pageCount
} from '@/services/sequence/snowflakeNamespaceApi';

export default {
  namespace: 'snowflakeNamespaceModel', // 这个是标示当前model的

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
        payload: {},
      });

      yield put({
        type: 'pageList',
        payload: {
          pager: {
            pageNo: 1,
            pageSize: 20,
          },
        },
      });
    },

    // 增加组配置
    *add({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.add 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(add, payload);
      yield put({
        type: 'handleAddResult',
        payload: response,
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh',
      });
    },

    // 删除组配置
    *delete({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.delete 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(deleteData, payload.id);
      const {errCode, errMsg} = response;
      console.log('snowflakeNamespaceModel.delete 结果：');
      console.log(JSON.stringify(response));
      // 调用失败
      if(errCode !== undefined && errCode != null && errCode !== 200){
        // 提示失败的弹窗
        notification.error({
          message: `错误`,
          description:`${errMsg}`,
        });
      }else{
        message.success('删除成功');
      }
      yield put({
        type: 'handleDeleteResult',
        payload: {
          response,
          id: payload.id,
        },
      });

      // 添加调用界面刷新
      yield put({
        type: 'tableFresh',
      });
    },

    // 修改组配置
    *update({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.update 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(update, payload);
      yield put({
        type: 'handleUpdateResult',
        payload: {
          response,
          param: payload,
        },
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh',
      });
    },

    // 获取配置列表
    *pageList({ payload }, { call, put }) {
      // console.log('snowflakeNamespaceModel.pageList 参数：');
      // console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      // console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
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
      const response = yield call(pageCount, values);
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

    handleDeleteResult(state, action) {
      // console.log('snowflakeNamespaceModel.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },
  },
};
