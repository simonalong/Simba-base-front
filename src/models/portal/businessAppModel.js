import {
  getNameList
} from '@/services/portal/businessAppApi';
import { notification } from 'antd';

export default {
  namespace: 'businessAppModel', // 这个是标示当前model的

  // 下面是定义的数据模型
  state: {
    businessNameList: [], // 搜索得到的用户列表
    selectedBusinessName: null, // 选择的业务名
  },

  // 异步处理函数
  effects: {
    // 根据用户名字进行模糊搜索获取得到用户列表
    *getBusinessNameList({ payload }, { call, put }) {
      // console.log('businessAppModel.getBusinessNameList 参数：');
      // console.log(JSON.stringify(payload));
      // eslint-disable-next-line no-undef
      // if (PORTAL_ENV === 'direct') {
      //   return;
      // }

      const response = yield call(getNameList, payload);
      // console.log('businessAppModel.getBusinessNameList 结果：');
      // console.log(JSON.stringify(response));
      const {errCode, errMsg} = response;

      // 调用失败
      if (errCode !== undefined && errCode != null && errCode !== 200) {
        // 提示失败的弹窗
        notification.error({
          message: `${errCode}`,
          description: `${errMsg}`,
        });
      }

      yield put({
        type: 'handleGetBusinessNameList',
        payload: {
          response,
        },
      });
    },
  },

  reducers: {
    // 保存授予中间件权限的用户名字
    saveBusinessName(state, action) {
      // eslint-disable-next-line no-undef
      if (PORTAL_ENV === 'direct') {
        return{
          ...state
        }
      }
      return {
        ...state,
        selectedBusinessName: action.payload
      };
    },

    // 保存从后端获取到的用户数据列表
    handleGetBusinessNameList(state, action) {
      // eslint-disable-next-line no-undef
      return {
        ...state,
        businessNameList: action.payload.response.data
      };
    },
  },
};
