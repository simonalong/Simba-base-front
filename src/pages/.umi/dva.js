import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'appGroupModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/barrier/appGroupModel.js').default) });
app.model({ namespace: 'applicationModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/barrier/applicationModel.js').default) });
app.model({ namespace: 'tagModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/barrier/tagModel.js').default) });
app.model({ namespace: 'authModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/common/authModel.js').default) });
app.model({ namespace: 'global', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/global.js').default) });
app.model({ namespace: 'juliaSwitchGroupModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/julia/juliaSwitchGroupModel.js').default) });
app.model({ namespace: 'juliaSwitchModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/julia/juliaSwitchModel.js').default) });
app.model({ namespace: 'list', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/menu.js').default) });
app.model({ namespace: 'AccountModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/AccountModel.js').default) });
app.model({ namespace: 'authCheckModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/authCheckModel.js').default) });
app.model({ namespace: 'businessAppModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/businessAppModel.js').default) });
app.model({ namespace: 'businessAuthModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/businessAuthModel.js').default) });
app.model({ namespace: 'businessLineModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/businessLineModel.js').default) });
app.model({ namespace: 'businessMemberModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/businessMemberModel.js').default) });
app.model({ namespace: 'businessModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/businessModel.js').default) });
app.model({ namespace: 'middlewareBusinessManagerModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/middlewareBusinessManagerModel.js').default) });
app.model({ namespace: 'middlewareMemberModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/middlewareMemberModel.js').default) });
app.model({ namespace: 'middlewareResourceGroupModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/middlewareResourceGroupModel.js').default) });
app.model({ namespace: 'middlewareResourceItemModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/middlewareResourceItemModel.js').default) });
app.model({ namespace: 'middlewareSystemModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/middlewareSystemModel.js').default) });
app.model({ namespace: 'resourceAuthModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/portal/resourceAuthModel.js').default) });
app.model({ namespace: 'project', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/project.js').default) });
app.model({ namespace: 'businessCityModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/robot/businessCityModel.js').default) });
app.model({ namespace: 'cityModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/robot/cityModel.js').default) });
app.model({ namespace: 'snowflakeNamespaceManagerModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/sequence/snowflakeNamespaceManagerModel.js').default) });
app.model({ namespace: 'snowflakeNamespaceModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/sequence/snowflakeNamespaceModel.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/user.js').default) });
app.model({ namespace: 'xcheckBillModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckBillModel.js').default) });
app.model({ namespace: 'xcheckCommonModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckCommonModel.js').default) });
app.model({ namespace: 'xcheckDiffModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckDiffModel.js').default) });
app.model({ namespace: 'xcheckExecutorNodeModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckExecutorNodeModel.js').default) });
app.model({ namespace: 'xcheckModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckModel.js').default) });
app.model({ namespace: 'xcheckTaskModel', ...(require('/Users/zhouzhenyong/project/isyscore/isc-front-base/src/models/xcheck/xcheckTaskModel.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
