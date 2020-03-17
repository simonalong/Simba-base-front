import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/portal' + '/' + 'middleware/resource/item';

export async function add(params) {
  console.log('middlewareResourceItemApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('middlewareResourceItemApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('middlewareResourceItemApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('middlewareResourceItemApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('middlewareResourceItemApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getListByMiddlewareId(params) {
  console.log('middlewareResourceItemApi.getListByMiddlewareId 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/getListByMiddlewareId/${params}`);
}

export async function getListByGroupId(params) {
  console.log('middlewareResourceItemApi.getListByGroupId 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/getListByGroupId/${params}`);
}


export async function nameExist(params) {
  console.log('middlewareResourceItemApi.nameExist 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/nameExist`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getResourceJsonData(params) {
  console.log('middlewareSystemApi.getResourceJsonData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/getResourceJsonData/${params}`);
}

export async function uploadJsonData(params) {
  console.log('middlewareSystemApi.uploadJsonData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/uploadJsonData`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
