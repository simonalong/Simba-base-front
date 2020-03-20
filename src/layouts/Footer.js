import React, { Fragment } from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          2020 Created by 杭州指令集智能科技有限公司
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
