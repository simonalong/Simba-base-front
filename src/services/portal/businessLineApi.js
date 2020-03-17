import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/portal' + '/' + 'business/line';

export async function add(params) {
  console.log('businessLineApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('businessLineApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('businessLineApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('businessLineApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('businessLineApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getBusinessLineList() {
  console.log('businessLineApi.getBusinessLineList 发送的参数');
  return request(`${path}/getList`);
}

export async function nameExist(params) {
  // console.log('businessLineApi.nameExist 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/nameExist/${params}`);
}







