import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'xcheck/task';

export async function pageCount(params) {
  // console.log('xcheckTaskApi.pageCount 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  // console.log('xcheckTaskApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





