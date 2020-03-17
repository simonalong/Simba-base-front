import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  searchOc,
  getAppDetail,
  removeTag,
  addTag,
  setTag,
  refresh,
} from '@/services/barrier/applicationApi';
import {
  listAll,
} from '@/services/barrier/tagApi';
import { invokeReq } from '@/utils/utils';

export default {
  namespace: 'applicationModel', // 这个是标示当前model的

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
    severNameList: [],
    appTagGroupList: [],
    appDetail: {
      unAllocatedMachines: [],
      allMachines: [],
      tags: []
    },
    tagNameList: [],
    appMachines: [],
  },

  // 异步处理函数
  effects: {
    *tableFresh({payload}, { put }) {
      yield put({
        type: 'pageCount',
        payload: {},
      });

      yield put({
        type: 'pageList',
        payload: {
          pager: {
            pageNo: 1,
            pageSize: 10,
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
        type: 'tableFresh',
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
        type: 'tableFresh',
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

    /*********************服务分组********************/
    *searchOc({ payload }, { call, put }) {
      if (payload.length < 4) {
        yield put({
          type: 'handleSearchOcTrim'
        });
        return
      }

      const response = invokeReq(yield call(searchOc, payload), false);
      yield put({
        type: 'handleSearchOc',
        payload: {
          response,
        },
      });
    },

    *getAppDetail({ payload }, { call, put }) {
      const response = invokeReq(yield call(getAppDetail, payload), false);

      yield put({
        type: 'handleGetAppDetail',
        payload: {
          response,
        },
      });
    },

    *listAllTag({ payload }, { call, put }) {
      const response = invokeReq(yield call(listAll, payload), false);
      yield put({
        type: 'handleListAllTag',
        payload: {
          response,
        },
      });
    },

    *removeTag({ payload }, { call, put }) {
      const params = {
        serverName: payload.serverName,
        tagName: payload.tagName,
      };

      invokeReq(yield call(removeTag, params), true);

      yield put({
        type: 'getAppDetail',
        payload: payload.serverName
      });
    },

    *addTag({ payload }, { call, put }) {
      invokeReq(yield call(addTag, payload), true);

      yield put({
        type: 'getAppDetail',
        payload: payload.serverName
      });
    },

    *setTag({ payload }, { call, put }) {
      invokeReq(yield call(setTag, payload), true);

      yield put({
        type: 'getAppDetail',
        payload: payload.serverName
      });
    },

    *refresh({ payload }, { call, put }) {
      invokeReq(yield call(refresh, payload.serverName), true);

      yield put({
        type: 'getAppDetail',
        payload: payload.serverName
      });
    }
    /*********************服务分组********************/
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
      // console.log('applicationModel.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      // console.log('applicationModel.handlePageListResult 返回的结果');
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
      // console.log('applicationModel.handleUpdateResult 返回的结果');
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
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },

    handleSearchOc(state, action) {
      return {
        ...state,
        serverNameList: action.payload.response.data
      };
    },

    handleSearchOcTrim(state, action) {
      return {
        ...state,
        serverNameList: []
      };
    },

    handleGetAppDetail(state, action) {
      let appDetail = action.payload.response.data;
      let appMachines = [];
      for (let i = 0; i < appDetail.allMachines.length; i++) {
        appMachines.push({
          key: `${appDetail.allMachines[i].ip}`,
          title: `${appDetail.allMachines[i].ip}(${appDetail.allMachines[i].hostName})`,
        });
      }

      return {
        ...state,
        appDetail: appDetail,
        appMachines: appMachines,
      };
    },

    handleListAllTag(state, action) {
      let allTags = action.payload.response.data;

      let tagNameList = allTags.filter(item => {
        let checked = true;
        for (let i = 0; i < state.appDetail.tags.length; i++) {
          if (item.name === state.appDetail.tags[i].tagName) {
            checked = false;
            break;
          }
        }
        return checked;
      });

      return {
        ...state,
        tagNameList: tagNameList,
      };
    },

    handleAddTag(state, action) {
      let tag = {};
      tag.tagName = action.payload.tagName;
      tag.machines = [];
      state.appDetail.tags.push(tag);

      return {
        ...state,
      };
    },
  },
};
