import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  getList,
} from '@/services/portal/businessApi';

export default {
  namespace: 'businessModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    maxTabIndex: 1, // 最大的标签页索引，用于标签新增计数用
    activePaneName: '1', // tabPane 的激活的key
    tabIndexList: ['1'], // 当前存在的标签的列表
    panes: [
      {
        name: '1',
        title: '业务授权1',
        content: {
          tableList: [],
          tableLoading: false,
          searchParam: {},
          totalNumber: 0,
          pager: {
            pageNo: 1,
            pageSize: 20,
          },
        },
      },
    ],
    groupAllCodeList: [], // 这个所有组的code列表
    groupCodeList: [], // 这个是配置对应的所有的code列表
    businessList: [], // 业务列表
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    *tableFresh({ payload }, { put }) {
      // console.log('business.tableFresh 参数：');
      // console.log(JSON.stringify(payload));
      yield put({
        type: 'pageCount',
        payload: {
          paneIndex: payload.paneIndex,
        },
      });

      yield put({
        type: 'pageList',
        payload: {
          paneIndex: payload.paneIndex,
          pager: {
            pageNo: 1,
            pageSize: 20,
          },
        },
      });
    },

    // 增加组配置
    *add({ payload }, { call, put }) {
      // console.log('business.add 参数：');
      // console.log(JSON.stringify(payload));
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }
      const response = yield call(add, payload);
      yield put({
        type: 'handleAddResult',
        payload: response,
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh',
        payload: {
          paneIndex: payload.paneIndex,
        },
      });
    },

    // 删除组配置
    *delete({ payload }, { call, put }) {
      // console.log('business.delete 参数：');
      // console.log(JSON.stringify(payload));
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }
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
        payload: {
          paneIndex: payload.paneIndex,
        },
      });
    },

    // 修改组配置
    *update({ payload }, { call, put }) {
      // console.log('business.update 参数：');
      // console.log(JSON.stringify(payload));
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }
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
        payload: {
          paneIndex: payload.paneIndex,
        },
      });
    },

    // 获取配置列表
    *pageList({ payload }, { call, put }) {
      console.log('business.pageList 参数：');
      console.log(JSON.stringify(payload));

      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
      console.log('business.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('business.pageCount 参数：');
      // console.log(JSON.stringify(payload));

      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }

      const params =
        payload === undefined || payload.searchParam === undefined ? {} : payload.searchParam;
      const pager = payload === undefined || payload.pager === undefined ? {} : payload.pager;
      const values = {
        ...params,
        ...pager,
      };

      // console.log(JSON.stringify(values));
      const count = yield call(pageCount, values);
      yield put({
        type: 'handleCountResult',
        payload: {
          paneIndex: payload.paneIndex,
          count,
        },
      });
    },

    // 获取业务列表
    *getList({payload}, {call, put}) {
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }
      // console.log('business.getList 参数：');
      const response = yield call(getList, payload);
      // console.log('business.getList 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handleBusinessList',
        payload: {
          response,
        }
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
      const newPanes = state.panes;
      const index = newPanes.findIndex(pane => pane.name === state.activePaneName);
      newPanes[index].content.tableLoading = true;

      return {
        ...state,
        panes: newPanes,
      };
    },

    handleCountResult(state, action) {
      console.log('business.handleCountResult 返回的结果');
      console.log(JSON.stringify(action.payload));

      const pl = action.payload;

      const newPanes = state.panes;
      const index = pl.paneIndex;

      newPanes[index].content.totalNumber = pl.count.data;

      return {
        ...state,
        panes: newPanes,
      };
    },

    handlePageListResult(state, action) {
      console.log('business.handlePageListResult 返回的结果');
      console.log(JSON.stringify(action));

      const pl = action.payload;

      const newPanes = state.panes;
      const index = pl.paneIndex;
      newPanes[index].content.searchParam = pl.searchParam;
      newPanes[index].content.pager.pageNo = pl.pager.pageNo;
      newPanes[index].content.tableList = pl.response.data;
      newPanes[index].content.tableLoading = false;

      return {
        ...state,
        panes: newPanes,
      };
    },

    handleAddResult(state) {
      return {
        ...state,
      };
    },

    handleUpdateResult(state, action) {
      console.log('business.handleUpdateResult 返回的结果');
      console.log(JSON.stringify(action.payload));

      // 若成功，则不不需要重新加载后端，而是直接修改前段的内存数据
      const { panes } = state;
      if (action.payload.response.data === 1) {
        // 更新所有的页签中的数据
        const newItem = action.payload.param;
        for (let index = 0; index < panes.length; index += 1) {
          const tableListNew = panes[index].content.tableList;
          const dataIndex = tableListNew.findIndex(item => newItem.id === item.id);

          if (dataIndex > -1) {
            tableListNew.splice(dataIndex, 1, {
              ...tableListNew[dataIndex],
              ...newItem,
            });
          }
          panes[index].content.tableLoading = false;
        }
      }

      return {
        ...state,
        panes,
      };
    },

    handleDeleteResult(state, action) {
      // console.log('business.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const { panes } = state;
      // 删除页签中的所有有关数据
      if (action.payload.response === '1') {
        for (let index = 0; index < panes.length; index += 1) {
          panes[index].content.tableList = panes[index].content.tableList.filter(
            item => item.id !== action.payload.id
          );
          panes[index].content.tableLoading = false;
        }
      }

      return {
        ...state,
        panes,
      };
    },

    // 增加标签
    addPane(state, action) {
      // console.log('business.addPane 参数：');
      // console.log(JSON.stringify(action));
      return {
        ...state,
        maxTabIndex: action.payload.maxTabIndex,
        tabIndexList: action.payload.tabIndexList,
        panes: action.payload.panes,
        activePaneName: action.payload.activePaneName,
      };
    },

    // 删除标签，自己如果是激活的
    deletePaneActive(state, action) {
      console.log('business.deletePaneActive 参数：');
      console.log(JSON.stringify(action.payload.activePaneName));
      return {
        ...state,
        panes: action.payload.panes,
        tabIndexList: action.payload.tabIndexList,
        activePaneName: action.payload.activePaneName,
      };
    },

    // 删除标签，自己非激活的
    deletePane(state, action) {
      console.log('business.deletePane 参数：');
      console.log(JSON.stringify(action.payload.activePaneName));
      return {
        ...state,
        panes: action.payload.panes,
        tabIndexList: action.payload.tabIndexList,
      };
    },

    // 激活标签
    activePane(state, action) {
      // console.log('business.activePane 参数：');
      // console.log(JSON.stringify(action));
      return {
        ...state,
        activePaneName: action.payload,
      };
    },

    // 保存业务列表
    handleBusinessList(state, action){
      return {
        ...state,
        businessList: action.payload.response.data
      };
    }

  },
};
