import request from '@/utils/request';

const path = '/sequence/sequence/snowflake/tool';

export async function checkUp(params) {
  console.log('snowflakeToolApi.checkUp 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/checkUp`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function forceGiveBack(params) {
  console.log('snowflakeToolApi.forceGiveBack 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/forceGiveBack`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addWorker(params) {
  console.log('snowflakeToolApi.addWorker 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/addWorker`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


