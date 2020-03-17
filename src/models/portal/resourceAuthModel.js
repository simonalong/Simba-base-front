import { notification, message } from 'antd';
import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  getResourceList,
} from '@/services/portal/resourceAuthApi';

export default {
  namespace: 'resourceAuthModel', // 这个是标示当前model的

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

    allResourceList: [],  // 当前用户拥有的要进行授予的资源
    haveResourceList: [], // 指定用户拥有的资源
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    *tableFresh({ payload }, { put }) {
      console.log('resourceAuth.tableFresh 参数：');
      console.log(JSON.stringify(payload));
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
      // console.log('resourceAuth.add 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(add, payload);
      yield put({type: 'authCheckModel/checkResponse', payload: response});
      const {errCode, errMsg} = response;
      // 调用失败
      if (errCode !== undefined && errCode != null && errCode !== 200) {
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description: `${errMsg}`,
        });
      } else {
        message.success('操作成功');
      }

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
      // console.log('resourceAuth.delete 参数：');
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
      // console.log('resourceAuth.update 参数：');
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
      console.log('resourceAuth.pageList 参数：');
      console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
      yield put({type: 'authCheckModel/checkResponse', payload: response});
      console.log('resourceAuth.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('resourceAuth.pageCount 参数：');
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

    // 根据用户和中间件id获取对应的资源数据
    *getResourceListByUserAndMiddlewareId({payload}, {call, put}) {
      console.log('resourceAuthModel.getResourceListByUserAndMiddlewareId 参数：');
      console.log(JSON.stringify(payload));

      const response = yield call(getResourceList, payload);
      console.log('resourceAuthModel.getResourceListByUserAndMiddlewareId 结果：');
      console.log(JSON.stringify(response));

      const {errCode, errMsg} = response;
      if (errCode !== undefined && errCode != null && errCode !== 200) {
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description: `${errMsg}`,
        });
      }

      // 1：表示当前用户获取数据
      if (payload.sendType === 1) {
        yield put({
          type: 'handleCurrentUserResourceList',
          payload: {
            response,
          },
        });
      } else {
        // 2：表示被授予的用户获取权限
        const resourceList = response.data;
        if (!resourceList) {
          return;
        }

        const resourceIdList = resourceList.map(item => item.resourceId);
        yield put({
          type: 'handleGivenUserResourceList',
          payload: {
            resourceIdList,
          },
        });
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
      console.log('resourceAuth.handleCountResult 返回的结果');
      console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      // console.log('resourceAuth.handlePageListResult 返回的结果');
      // console.log(JSON.stringify(action));

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
      console.log('resourceAuth.handleUpdateResult 返回的结果');
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
      // console.log('resourceAuth.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },

    // 界面上保存目标资源项列表
    updateTargetKeys(state, action){
      console.log('resourceAuthModel.updateTargetKeys 参数：');
      console.log(JSON.stringify(action));
      return{
        ...state,
        haveResourceList: action.payload
      }
    },

    // 保存当前用户的权限数据
    handleCurrentUserResourceList(state, action){
      console.log('resourceAuth.handleCurrentUserResourceList 参数：');
      console.log(JSON.stringify(action));
      return {
        ...state,
        allResourceList: action.payload.response.data,
      };
    },

    // 保存被给予的用户的权限数据
    handleGivenUserResourceList(state, action) {
      console.log('resourceAuth.handleGivenUserResourceList 参数：');
      console.log(JSON.stringify(action));
      return {
        ...state,
        haveResourceList: action.payload.resourceIdList,
      };
    },

    cleanResourceList(state){
      return {
        ...state,
        allResourceList: [],
        haveResourceList: [],
      };
    }
  },
};
