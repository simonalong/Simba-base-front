import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/portal' + '/' + 'middleware/system';

export async function add(params) {
  console.log('middlewareSystemApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('middlewareSystemApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('middlewareSystemApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('middlewareSystemApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('middlewareSystemApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getMiddlewareNameList() {
  // console.log('middlewareApi.getMiddlewareNameList 发送的参数');
  return request(`${path}/getNameList`);
}

export async function systemExist(params) {
  // console.log('middlewareApi.systemExist 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/systemExist/${params}`);
}

export async function debugRun(params) {
  console.log('middlewareSystemApi.debugRun 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/debugRun`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function debugStop(params) {
  console.log('middlewareSystemApi.debugStop 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/debugStop`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}




