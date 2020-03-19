import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/robot/city';

export async function add(params) {
  console.log('cityApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('cityApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('cityApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('cityApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('cityApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





