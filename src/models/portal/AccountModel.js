import {
  getAccountList
} from '@/services/portal/accountApi';

export default {
  namespace: 'accountModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    userAccountList: [], // 搜索得到的用户列表
    selectedAccountValue: null, // 选择的用户名
  },

  // 异步处理函数
  effects: {
    // 根据用户名字进行模糊搜索获取得到用户列表
    *getAccountList({ payload }, { call, put }) {
      // console.log('middleware.getUserList 参数：');
      // console.log(JSON.stringify(payload));

      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return;
      }

      const response = yield call(getAccountList, payload);
      // console.log('middleware.getUserList 结果：');
      // console.log(JSON.stringify(response));
      yield put({
        type: 'handleGetAccountList',
        payload: {
          response,
        },
      });
    },
  },

  reducers: {
    // 保存授予中间件权限的用户名字
    saveAccountName(state, action) {
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return{
          ...state
        }
      }
      return {
        ...state,
        selectedAccountValue: action.payload
      };
    },

    // 保存从后端获取到的用户数据列表
    handleGetAccountList(state, action) {
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return{
          ...state
        }
      }
      return {
        ...state,
        userAccountList: action.payload.response.data
      };
    },
  },
};
