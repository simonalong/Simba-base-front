import { routerRedux } from 'dva/router';
import {
  haveAuth
} from '@/services/portal/authCheckApi';


export default {
  namespace: 'authCheckModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
  },

  // 异步处理函数
  effects: {
    // 核查菜单页面权限
    *checkPage({payload}, {put, call}) {
      console.log('authCheckModel.checkPage 参数：');

      // 直连则不核查权限
      // eslint-disable-next-line no-undef
      if(PORTAL_ENV === 'direct'){
        return;
      }
      const response = yield call(haveAuth, payload);
      console.log('authCheckModel.pageList 结果：');

      // 调用界面刷新
      yield put({
        type: 'checkResponse',
        payload: response,
      });
    },

    // 核查返回值
    *checkResponse({payload}, {put}) {
      // console.log('authCheckModel.checkResponse 结果：');
      // console.log(JSON.stringify(payload));
      if(!payload){
        return;
      }
      const {errCode} = payload;
      // 非失败返回
      if(!errCode){
        return;
      }

      // 无权限
      if (errCode === 403) {
        yield put(routerRedux.replace('/exception/403'));
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
  },
};
