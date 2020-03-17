import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
} from '@/services/barrier/tagApi';
import { invokeReq } from '@/utils/utils';
import {message} from "antd/lib/index";
import { notification } from 'antd';

export default {
  namespace: 'tagModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    // 数据
    tableList: [],
    tableLoading: false,
    searchParam: {},
    totalNumber: 0,
    pager: {
      pageNo: 1,
      pageSize: 10,
    },
    types: [
      {value: 0, color: 'red', label: '系统级'},
      {value: 1, color: 'orange', label: '平台级'},
      {value: 2, color: 'green', label: '应用级'},
    ],
    demotions: [
      {value: 0, color: 'red', label: '不允许'},
      {value: 1, color: 'green', label: '允许'},
    ],
    computeTypes: [
      {value: 0, color: 'red', label: '排除'},
      {value: 1, color: 'green', label: '包含'},
    ],
    transmits: [
      {value: 0, color: 'red', label: '不允许'},
      {value: 1, color: 'green', label: '允许'},
    ],
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    // eslint-disable-next-line no-unused-vars
    *tableFresh({payload}, { put }) {

      yield put({
        type: 'pageList',
        payload: {
          pager: {
            pageNo: 1,
            pageSize: 10
          },
        },
      });
    },

    // 增加组配置
    *add({ payload }, { call, put }) {
      const response = invokeReq(yield call(add, payload), true);

      yield put({
        type: 'handleAddResult',
        payload: response,
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh'
      });
    },

    // 删除组配置
    *delete({ payload }, { call, put }) {
      const response = invokeReq(yield call(deleteData, payload.id), true);

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
      const response = invokeReq(yield call(update, payload), true);

      yield put({
        type: 'handleUpdateResult',
        payload: {
          response,
          param: payload,
        },
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh'
      });
    },

    // 获取配置列表
    *pageList({ payload }, { call, put }) {
      const values = {
        page: payload.pager.pageNo,
        limit: payload.pager.pageSize,
        ...payload.searchParam,
      };
      const response = invokeReq(yield call(pageList, values), false);
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
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
      // console.log('tagModel.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      // console.log('tagModel.handlePageListResult 返回的结果');
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
        tableLoading: false,
        totalNumber: pl.response.totalCount,
      };
    },

    handleAddResult(state) {
      return {
        ...state,
      };
    },

    handleUpdateResult(state, action) {
      // console.log('tagModel.handleUpdateResult 返回的结果');
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
      // console.log('tagModel.handleDeleteResult 返回的结果');
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
