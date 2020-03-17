import request from "@/utils/request";

const path = '/platform/portal';

// eslint-disable-next-line import/prefer-default-export
export async function getNameList(params) {
  // console.log('middlewareApi.getNameList 发送的参数');
  return request(`${path}/rocket/app/getList/${params}`);
}


