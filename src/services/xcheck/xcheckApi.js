import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'xcheck';

export async function add(params) {
  // console.log('xcheckApi.add 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  // console.log('xcheckApi.deleteData 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'GET',
  });
}

export async function update(params) {
  // console.log('xcheckApi.update 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  // console.log('xcheckApi.pageCount 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  // console.log('xcheckApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function enable(params) {
  // console.log('xcheckApi.enable 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/enable/${params}`, {
    method: 'GET',
  });
}

export async function disable(params) {
  // console.log('xcheckApi.disable 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/disable/${params}`, {
    method: 'GET',
  });
}

export async function repair(params) {
  // console.log('xcheckApi.repair 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/repair/${params}`, {
    method: 'GET',
  });
}

export async function interrupt(params) {
  // console.log('xcheckApi.repair 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/interrupt/${params}`, {
    method: 'GET',
  });
}

export async function dictList() {
  // console.log('xcheckApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/dictList`, {
    method: 'POST',
  });
}





