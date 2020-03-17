import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'xcheck/executor/node';

export async function pageCount(params) {
  // console.log('xcheckExecutorNodeApi.pageCount 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  // console.log('xcheckExecutorNodeApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





