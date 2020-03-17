import { notification } from 'antd';
import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  nameExist,
  getResourceJsonData,
  uploadJsonData,
} from '@/services/portal/middlewareResourceItemApi';

export default {
  namespace: 'middlewareResourceItemModel', // 这个是标示当前model的

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

    resourceJsonData: null,
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    // eslint-disable-next-line no-unused-vars
    *tableFresh({ payload }, { put }) {
      // console.log('middlewareResourceItem.tableFresh 参数：');
      // console.log(JSON.stringify(payload));
      yield put({
        type: 'pageCount',
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
      // console.log('middlewareResourceItem.add 参数：');
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
      // console.log('middlewareResourceItem.delete 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(deleteData, payload.id);
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
      // console.log('middlewareResourceItem.update 参数：');
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
      console.log('middlewareResourceItem.pageList 参数：');
      console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
      console.log('middlewareResourceItem.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('middlewareResourceItem.pageCount 参数：');
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
          response
        },
      });
    },

    // 资源是否存在
    // 获取中间件名字列表
    *nameValueCheck({payload, callback}, {call}) {
      // console.log('middlewareResourceItemModel.nameValueCheck 参数：');
      // console.log(JSON.stringify(payload));

      if (payload !== "") {
        const response = yield call(nameExist, payload);
        // console.log('middlewareResourceItemModel.nameValueCheck 结果：');
        // console.log(JSON.stringify(response));
        if (response.data === 1) {
          callback("当前名字已经存在");
        } else {
          callback();
        }
      }
    },

    // 获取资源对应的json数据
    *getResourceJsonData({ payload }, { call, put }) {
      console.log('middlewareResourceItemModel.getResourceJsonData 参数：');
      console.log(JSON.stringify(payload));

      const response = yield call(getResourceJsonData, payload);
      console.log('middlewareResourceItemModel.getResourceJsonData 结果：');
      console.log(JSON.stringify(response));
      yield put({
        type: 'handleResourceJsonData',
        payload: {
          response,
        },
      });
    },

    // 录入资源对应的项目
    *uploadJsonData({ payload }, { call, put }) {
      // console.log('middlewareResourceItemModel.uploadJsonData 参数：');
      // console.log(JSON.stringify(payload));

      const response = yield call(uploadJsonData, payload);
      // console.log('middlewareResourceItemModel.uploadJsonData 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handleUploadJsonData',
        payload: {
          response,
        },
      });

      const errData = response.data;
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const key in errData) {
        notification.error({
          message: `告警`,
          description: `${key}：${errData[key]}`,
        });
      }

      // 调用界面刷新
      yield put({
        type: 'tableFresh',
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
      // console.log('middlewareResourceItemModel.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      console.log('middlewareResourceItemModel.handlePageListResult 返回的结果');
      console.log(JSON.stringify(action));

      const pl = action.payload;

      let tableList;
      if(pl.response){
        tableList = pl.response.data
      }

      return {
        ...state,
        pager:{
          ...pl.pager,
          pageNo:pl.pager.pageNo
        },
        tableList,
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
      // console.log('middlewareResourceItemModel.handleUpdateResult 返回的结果');
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
      // console.log('switchGroupTestModel.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },

    // 保存json信息
    handleResourceJsonData(state, action) {
      console.log('middlewareSystem.handleResourceJsonData 返回的结果');
      console.log(JSON.stringify(action.payload.response.data));

      return {
        ...state,
        resourceJsonData: action.payload.response.data,
      };
    },

    // 清理资源的Json数据
    // eslint-disable-next-line no-unused-vars
    clearResourceJsonData(state, action){
      // console.log('middlewareSystem.clearResourceJsonData 返回的结果');
      // console.log(JSON.stringify(action));
      return {
        ...state,
        resourceJsonData:"",
      }
    },

    // 保存json信息
    // eslint-disable-next-line no-unused-vars
    handleUploadJsonData(state, action) {
      console.log('middlewareSystem.handleUploadJsonData 返回的结果');

      return {
        ...state,
      };
    },


  },
};
