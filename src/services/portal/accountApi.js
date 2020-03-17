import request from "@/utils/request";

const path = '/platform/portal';

// eslint-disable-next-line import/prefer-default-export
export async function getAccountList(params) {
  // console.log('middlewareApi.getAccountList 发送的参数');
  return request(`${path}/account/getAccountList/${params}`);
}
