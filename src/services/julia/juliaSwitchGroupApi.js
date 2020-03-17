import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/julia/julia/switch/group';

export async function add(params) {
  console.log('juliaSwitchGroupApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('juliaSwitchGroupApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('juliaSwitchGroupApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('juliaSwitchGroupApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('juliaSwitchGroupApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getNameList(params) {
  console.log('juliaSwitchGroupApi.getNameList 发送的参数');
  return request(`${path}/account/getNameList/${params}`);
}

export async function getGroupList() {
  console.log('juliaSwitchGroupApi.getGroupList 发送的参数');
  return request(`${path}/getList`);
}

export async function nameExist(params) {
  // console.log('juliaSwitchGroupApi.nameExist 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/nameExist`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}




