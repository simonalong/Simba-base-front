import {
  pageList,
  add,
  update,
  pageCount,
  dictList
} from '@/services/xcheck/xcheckBillApi';
import { message, Button } from 'antd';

export default {
  namespace: 'xcheckBillModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    maxTabIndex: 1, // 最大的标签页索引，用于标签新增计数用
    activePaneName: '1', // tabPane 的激活的key
    tabIndexList: ['1'], // 当前存在的标签的列表
    panes: [
      {
        name: '1',
        title: '账单1',
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

    xcheckBillDict: [],
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    *tableFresh({ payload }, { put }) {
      // console.log('xcheckBill.tableFresh 参数：');
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
      // console.log('xcheckBill.add 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(add, payload);

      const {errMsg} = response;
      if (errMsg !== undefined && errMsg != null) {
        message.error(errMsg);
      }
      else
      {
        message.success('操作成功');
      }

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

    // 修改组配置
    *update({ payload }, { call, put }) {
      // console.log('xcheckBill.update 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(update, payload);

      const {errMsg} = response;
      if (errMsg !== undefined && errMsg != null) {
        message.error(errMsg);
      }
      else
      {
        message.success('操作成功');
      }

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
      // console.log('xcheckBill.pageList 参数：');
      // console.log(JSON.stringify(payload));
      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      // console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
      // console.log('xcheckBill.pageList 结果：');
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('xcheckBill.pageCount 参数：');
      // console.log(JSON.stringify(payload));

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

    *dictList({ payload }, { call, put }) {
      // console.log('xcheckBill.pageList 参数：');
      // console.log(JSON.stringify(payload));

      const response = yield call(dictList);
      yield put({
        type: 'handleDictListResult',
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
      const newPanes = state.panes;
      const index = newPanes.findIndex(pane => pane.name === state.activePaneName);
      newPanes[index].content.tableLoading = true;

      return {
        ...state,
        panes: newPanes,
      };
    },

    handleCountResult(state, action) {
      // console.log('xcheckBill.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

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
      // console.log('xcheckBill.handlePageListResult 返回的结果');
      // console.log(JSON.stringify(action));

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
      // console.log('xcheckBill.handleUpdateResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      // 若成功，则不不需要重新加载后端，而是直接修改前段的内存数据
      const { panes } = state;
      if (action.payload.response === 1) {
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

    // 增加标签
    addPane(state, action) {
      // console.log('xcheckBill.addPane 参数：');
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
      // console.log('xcheckBill.deletePaneActive 参数：');
      // console.log(JSON.stringify(action.payload.activePaneName));
      return {
        ...state,
        panes: action.payload.panes,
        tabIndexList: action.payload.tabIndexList,
        activePaneName: action.payload.activePaneName,
      };
    },

    // 删除标签，自己非激活的
    deletePane(state, action) {
      // console.log('xcheckBill.deletePane 参数：');
      // console.log(JSON.stringify(action.payload.activePaneName));
      return {
        ...state,
        panes: action.payload.panes,
        tabIndexList: action.payload.tabIndexList,
      };
    },

    // 激活标签
    activePane(state, action) {
      // console.log('xcheckBill.activePane 参数：');
      // console.log(JSON.stringify(action));
      return {
        ...state,
        activePaneName: action.payload,
      };
    },

    handleDictListResult(state, action){
      // console.log('xcheckBill.handleDictListResult 参数：');
      // console.log(JSON.stringify(action));
      return {
        ...state,
        xcheckBillDict: action.payload.response.data,
      };
    }

  },
};
