import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'xcheck/diff';

export async function pageCount(params) {
  // console.log('xcheckDiffApi.pageCount 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  // console.log('xcheckDiffApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





