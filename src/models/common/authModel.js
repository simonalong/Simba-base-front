import {
  getAuthOfUser,
} from '@/services/common/authApi';
import { setAuthority } from '@/utils/authority';

export default {
  namespace: 'authModel',

  state: {},

  effects: {
    // 获取最新的权限数据
    *getAuthOfUser({ payload }, { call, put }) {
      // console.log('authModel.getAuthOfUser.add 参数：');
      // console.log(JSON.stringify(payload));
      const response = yield call(getAuthOfUser, payload);
      yield put({
        type: 'handleGetAuthOfUser',
        payload: response.data,
      });
    },
  },

  reducers: {
    // 处理获取用户对应的权限
    handleGetAuthOfUser(state, action) {
      console.log('authModel.handleGetAuthOfUser 返回的结果');
      console.log(JSON.stringify(action.payload.authCodeList));
      setAuthority(action.payload.authCodeList);
      return {
        ...state,
      };
    },
  },
};
