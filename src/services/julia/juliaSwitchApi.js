import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/julia' + '/' + 'julia/switch';

export async function add(params) {
  console.log('juliaSwitchApi.add 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  console.log('juliaSwitchApi.deleteData 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  console.log('juliaSwitchApi.update 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  console.log('juliaSwitchApi.pageCount 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  console.log('juliaSwitchApi.pageList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getAllGrayIpList(params) {
  console.log('juliaSwitchApi.getAllGrayIpList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/gray/allIpList/${params}`);
}

export async function getGraySelectedIpList(params) {
  console.log('juliaSwitchApi.getGraySelectedIpList 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/gray/selectedIpList/${params}`);
}

export async function submitGraySelect(params) {
  console.log('juliaSwitchApi.submitGraySelect 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/gray/submitGraySelect`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function applyGray(params) {
  console.log('juliaSwitchApi.applyGray 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/gray/applyGray`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function rollbackGray(params) {
  console.log('juliaSwitchApi.rollbackGray 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/gray/rollbackGray`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function nameExist(params) {
  console.log('juliaSwitchApi.nameExist 发送的参数');
  console.log(JSON.stringify(params));
  return request(`${path}/nameExist`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}





