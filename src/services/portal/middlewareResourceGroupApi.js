import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/portal' + '/' + 'middleware/resource/group';

export async function add(params) {
  console.log('middlewareResourceGroupApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('middlewareResourceGroupApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('middlewareResourceGroupApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('middlewareResourceGroupApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('middlewareResourceGroupApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateRelation(params) {
  console.log('middlewareResourceGroupApi.updateRelation 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/updateRelation`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getList() {
  console.log('middlewareResourceGroupApi.getList 发送的参数');
  return request(`${path}/getList`);
}





