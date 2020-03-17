import { notification } from 'antd';
import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  getGroupList,
  nameExist,
} from '@/services/julia/juliaSwitchGroupApi';

export default {
  namespace: 'juliaSwitchGroupModel', // 这个是标示当前model的

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

    getGroupList:[], // 获取列表
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    // eslint-disable-next-line no-unused-vars
    *tableFresh({ payload }, { put }) {
      // console.log('juliaSwitchGroup.tableFresh 参数：');
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
      // console.log('juliaSwitchGroup.add 参数：');
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
      // console.log('juliaSwitchGroup.delete 参数：');
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
      // console.log('juliaSwitchGroup.update 参数：');
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
      console.log('juliaSwitchGroup.pageList 参数：');
      console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      console.log(JSON.stringify(values));
      const response = yield call(pageList, values);

      const {errCode, errMsg} = response;

      // 调用失败
      if (errCode !== undefined && errCode != null && errCode !== 200) {
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description: `${errMsg}`,
        });
      }

      console.log('juliaSwitchGroup.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('juliaSwitchGroup.pageCount 参数：');
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

    // 开关组集合
    // eslint-disable-next-line no-unused-vars
    *getGroupList({ payload }, { call, put }){
      // console.log('juliaSwitchGroup.getGroupList 参数：');
      // console.log(JSON.stringify(payload));

      const response = yield call(getGroupList);
      // console.log('juliaSwitchGroup.getGroupList 结果：');
      // console.log(JSON.stringify(response));

      yield put({
        type: 'handleGroupList',
        payload: {
          response,
        },
      });
    },

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
      console.log('juliaSwitchGroup.handleCountResult 返回的结果');
      console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      console.log('juliaSwitchGroup.handlePageListResult 返回的结果');
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
      console.log('juliaSwitchGroup.handleUpdateResult 返回的结果');
      console.log(JSON.stringify(action.payload));

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
      // console.log('juliaSwitchGroup.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },

    handleGroupList(state, aciton){
      console.log(JSON.stringify(aciton));
      return{
        ...state,
        getGroupList: aciton.payload.response.data
      };
    }
  },
};
