import request from '@/utils/request';

// eslint-disable-next-line no-useless-concat
const path = '/platform/xcheck' + '/' + 'xcheck/bill';

export async function add(params) {
  // console.log('xcheckBillApi.add 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function deleteData(params) {
  // console.log('xcheckBillApi.deleteData 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/delete/${params}`, {
    method: 'GET',
  });
}

export async function update(params) {
  // console.log('xcheckBillApi.update 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageCount(params) {
  // console.log('xcheckBillApi.pageCount 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/count`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function pageList(params) {
  // console.log('xcheckBillApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/pageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function dictList() {
  // console.log('xcheckBillApi.pageList 发送的参数');
  // console.log(JSON.stringify(params));
  return request(`${path}/dictList`, {
    method: 'POST',
  });
}





