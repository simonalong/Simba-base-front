import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import {getUserInfo} from "@/utils/userInfo";

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url        The URL we want to request
 * @param  {object} [option]   The options we want to pass to "fetch"
 * @param  {string} authCheck  backend will check the user'auth of url if value is "1"
 * @return {object}            An object containing either "data" or "err"
 */
export default function request(url, option, authCheck) {
  let optionFinal = option;
  let urlFinal = url;
  let uri = url;
  let param;
  const userInfo = getUserInfo();

  // 如果不是portal应用，则转换为跳转路径，非直连环境下才考虑转换
  // eslint-disable-next-line no-undef
  if(PORTAL_ENV !== 'direct' && !url.startsWith("/platform/portal/") && !url.startsWith("/portal/")) {
    let urlTem = url;
    // 兼容旧的api访问方式（旧的api访问方式，前缀有个/platform）
    if(urlTem.startsWith("/platform/")) {
      // 去除/platform之后的字符串
      urlTem = urlTem.substring("/platform/".length, urlTem.length);
    }else{
      // 去除 / 之后的字符串（默认为第一个字符为变量的名字）
      // eslint-disable-next-line no-lonely-if
      if (urlTem.startsWith("/")) {
        urlTem = urlTem.substring("/".length, urlTem.length);
      }
    }

    // 获取
    const appName = urlTem.substring(0, urlTem.indexOf("/"));
    uri = urlTem.substring(appName.length + 1);

    // 拼接新的参数
    param = {
      // 应用名字
      appName,
      // 应用后面请求的url
      url: uri,
      // 操作该方式的用户
      userName: userInfo.displayName,
      // method 请求类型
      // headers 对应处理的头部信息
      // body 请求对应的参数
      ...option
    };

    // 如果method没有填写，则采用默认的get
    if(!param.method){
      param={
        method: "get",
        ...param
      }
    }

    urlFinal = "/platform/middleware";

    optionFinal={
      method: 'POST',
      body: {
        ...param,
      },
    }
  }

  if(url.startsWith("/portal")){
    urlFinal = `/platform${url}`;
  }

  // eslint-disable-next-line no-undef
  if(PORTAL_ENV !== 'direct'){
    optionFinal={
      headers: {
        'userName': userInfo.displayName,
        'currentPath': localStorage.getItem('currentPath'),
        'authCheck': authCheck,
      },
      ...optionFinal,
    };
  }

  console.log("optionTem");
  console.log(JSON.stringify(urlFinal));
  console.log(JSON.stringify(optionFinal));

  const options = {
    expirys: isAntdPro(),
    ...optionFinal,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = urlFinal + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(urlFinal, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
