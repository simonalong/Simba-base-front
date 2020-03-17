import React, { Fragment } from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          2019 Created by 格家网络中间件稳定性平台
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
