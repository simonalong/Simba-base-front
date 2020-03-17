import {request} from '@/utils/request';

const path = '/platform/portal';

export async function add(params) {
  console.log('middlewareApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/middleware/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('middlewareApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/middleware/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('middlewareApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/middleware/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('middlewareApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/middleware/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('middlewareApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/middleware/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





