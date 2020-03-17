import request from "@/utils/request";

const path = '/platform/portal';

// eslint-disable-next-line import/prefer-default-export,no-unused-vars
export async function haveAuth(param) {
  // console.log('middlewareApi.getAccountList 发送的参数');
  return request(`${path}/account/haveAuth`);
}
