import { notification, message } from 'antd';
import {
  pageList,
  add,
  deleteData,
  update,
  pageCount,
  getAllGrayIpList,
  getGraySelectedIpList,
  submitGraySelect,
  applyGray,
  rollbackGray,
  nameExist,
} from '@/services/julia/juliaSwitchApi';

export default {
  namespace: 'juliaSwitchModel', // 这个是标示当前model的

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

    allList: [], // 指定的某个资源组对应的资源集合
    targetList:[], // 保存关联关系的目标集合
    originalTargetList:[], // 保留原生的目标集合
    switchLoadingList:[], // 开关的刷新标识
  },

  // 异步处理函数
  effects: {
    // 用于其他操作之后刷新界面
    // eslint-disable-next-line no-unused-vars
    *tableFresh({ payload }, { put }) {
      // console.log('juliaSwitch.tableFresh 参数：');
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
      // console.log('juliaSwitch.add 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(add, payload);
      yield put({
        type: 'handleDefault',
        payload: response,
      });

      // 调用界面刷新
      yield put({
        type: 'tableFresh',
      });
    },

    // 删除组配置
    *delete({ payload }, { call, put }) {
      // console.log('juliaSwitch.delete 参数：');
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
      // console.log('juliaSwitch.update 参数：');
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
      // console.log('juliaSwitch.pageList 参数：');
      // console.log(JSON.stringify(payload));

      const values = {
        ...payload.pager,
        param: payload.searchParam,
      };

      // console.log(JSON.stringify(values));
      const response = yield call(pageList, values);
      // console.log('juliaSwitch.pageList 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handlePageListResult',
        payload: {
          response,
          ...payload,
        },
      });
    },

    *pageCount({ payload }, { call, put }) {
      // console.log('juliaSwitch.pageCount 参数：');
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

    // 获取当前组的所有ip列表
    *getAllGrayIpList({payload}, {call, put}) {
      const response = yield call(getAllGrayIpList, payload);
      // console.log('middlewareResourceGroup.getAllGrayIpList 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handleAllGrayIpList',
        payload: {
          response,
        },
      });
    },

    // 获取当前key关联的ip列表
    *getGraySelectedIpList({payload}, {call, put}) {
      const response = yield call(getGraySelectedIpList, payload);
      // console.log('middlewareResourceGroup.getGraySelectedIpList 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handleGraySelectedIpList',
        payload: {
          response,
        },
      });
    },

    // 提交灰度配置
    *submitGraySelect({payload}, {call, put}){
      // console.log('middlewareResourceGroup.submitGraySelect 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(submitGraySelect, payload);
      console.log('middlewareResourceGroup.submitGraySelect 结果：');
      console.log(JSON.stringify(response));
      yield put({
        type: 'handleDefault',
        payload: {},
      });

      const {errCode, errMsg} = response;

      // 调用失败
      if (errCode !== undefined && errCode != null && errCode !== 200) {
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description: `${errMsg}`,
        });
      } else {
        message.success('发布灰度成功');
      }

      // 调用成功，则刷新页面
      yield put({
        type: 'tableFresh',
      });
    },

    // 应用灰度
    *applyGray({payload}, {call, put}){
      // console.log('middlewareResourceGroup.applyGray 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(applyGray, payload);
      console.log('middlewareResourceGroup.applyGray 结果：');
      console.log(JSON.stringify(response));
      yield put({
        type: 'handleDefault',
        payload: {},
      });

      const {errCode, errMsg} = response;

      // 调用失败
      if(errCode !== undefined && errCode != null && errCode !== 200){
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description:`${errMsg}`,
        });
      }else{
        message.success('全量发布灰度应用成功');
      }
      // 调用成功，则刷新页面
      yield put({
        type: 'tableFresh',
      });
    },

    // 回滚灰度
    *rollbackGray({payload}, {call, put}){
      // console.log('middlewareResourceGroup.rollbackGray 参数：');
      // console.log(JSON.stringify(payload));

      const response = yield call(rollbackGray, payload);
      console.log('middlewareResourceGroup.rollbackGray 结果：');
      console.log(JSON.stringify(response));
      yield put({
        type: 'handleDefault',
        payload: {},
      });

      const {errCode, errMsg} = response;

      // 调用失败
      if(errCode !== undefined && errCode != null && errCode !== 200){
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description:`${errMsg}`,
        });
      } else {
        message.success('灰度取消成功');
      }

      // 调用成功，则刷新页面
      yield put({
          type: 'tableFresh',
        });
    },

    // 获取中间件名字列表
    *nameValueCheck({payload, callback}, {call}) {
      console.log('middlewareResourceGroup.nameValueCheck 参数：');
      console.log(JSON.stringify(payload));

      if (payload !== "") {
        const response = yield call(nameExist, payload);
        // console.log('middlewareResourceGroup.nameValueCheck 结果：');
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
      // console.log('juliaSwitch.handleCountResult 返回的结果');
      // console.log(JSON.stringify(action.payload));

      const pl = action.payload;
      return {
        ...state,
        totalNumber: pl.response.data,
      };
    },

    handlePageListResult(state, action) {
      // console.log('juliaSwitch.handlePageListResult 返回的结果');
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

    handleUpdateResult(state, action) {
      console.log('juliaSwitch.handleUpdateResult 返回的结果');
      console.log(JSON.stringify(action.payload));
      console.log('juliaSwitch.switchLoadingList 返回的结果');

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
      // console.log('juliaSwitch.handleDeleteResult 返回的结果');
      // console.log(action.payload);
      const {tableList} = state;
      const tableListTem = tableList.filter(item => item.id !== action.payload.id);

      return {
        ...state,
        tableList: tableListTem,
        tableLoading: false,
      };
    },

    // 保存资源组对应的资源项列表
    handleAllGrayIpList(state, action){
      console.log('middlewareResourceGroup.handleAllGrayIpList 结果：');
      console.log(JSON.stringify(action));
      return{
        ...state,
        allList: action.payload.response.data
      }
    },

    // 界面上保存目标资源项列表
    updateTargetKeys(state, action) {
      console.log('middlewareResourceGroup.updateTargetKeys 参数：');
      console.log(JSON.stringify(action));
      return {
        ...state,
        targetList: action.payload
      }
    },

    // 保存通过中间件id获取的所有资源项列表
    handleGraySelectedIpList(state, action) {
      console.log('middlewareResourceGroup.handleGraySelectedIpList 参数：');
      console.log(JSON.stringify(action));
      return {
        ...state,
        targetList: action.payload.response.data,
        originalTargetList: action.payload.response.data
      }
    },

    // 对状态不做任何更改
    handleDefault(state) {
      return {
        ...state,
      }
    },

    // 设置开关的状态为loading
    setSwitchLoading(state, action) {
      console.log('middlewareResourceGroup.handleGraySelectedIpList 参数：');
      console.log(JSON.stringify(action));

      const {switchLoadingList} = state;
      let haveValue = false;
      for (let index = 0; index < switchLoadingList.length; index += 1) {
        if (switchLoadingList[index].id === action.payload.switchId) {
          switchLoadingList[index].loading = true;
          haveValue = true;
        }
      }

      if (!haveValue) {
        switchLoadingList.push({
          id: action.payload.switchId,
          loading: true
        });
      }

      console.log('middlewareResourceGroup.handleGraySelectedIpList 参数：');
      console.log(JSON.stringify(switchLoadingList));
      return {
        ...state,
        switchLoadingList,
      };
    }
  },
};
