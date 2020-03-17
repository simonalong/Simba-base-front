import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Badge,
  Form,
  Input,
  Button,
  Table,
  Avatar,
  Select,
  DatePicker,
  Pagination,
  InputNumber,
  Tabs,
  Modal,
} from 'antd';

import moment from 'moment';
import styles from './BusinessAuthList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal, middlewareNameList, businessNameList, handleListChange, handleListSearch, userAccountList, handleAccountListChange, handleAccountListSearch } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  let nameOptions;
  if(middlewareNameList){
    nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
  }

  let businessNameOption;
  if (businessNameList) {
    businessNameOption = businessNameList.map(d => <Select.Option key={d.name}>{d.name}</Select.Option>);
  }

  let userOption;
  if(userAccountList){
    userOption = userAccountList.map(d => <Select.Option key={d.cn}>{d.cn}-{d.displayName}</Select.Option>);
  }

  return (
    <Modal
      destroyOnClose
      title="新增"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideAddModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="中间件系统" hasFeedback>
        {form.getFieldDecorator('middlewareId', {
          rules: [{ required: true, message: '请输入中间件系统！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择系统名"
            optionFilterProp="children"
          >
            {nameOptions}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务系统名" hasFeedback>
        {form.getFieldDecorator('businessName', {
          rules: [{ required: true, message: '请输入业务系统名！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择用户名"
            // style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleListSearch}
            onChange={handleListChange}
            notFoundContent={null}
          >
            {businessNameOption}
          </Select>
          )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="被授予人名字" hasFeedback>
        {form.getFieldDecorator('beAuthUserName', {
          rules: [{ required: true, message: '请输入被授予人名字！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择用户名"
            // style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleAccountListSearch}
            onChange={handleAccountListChange}
            notFoundContent={null}
          >
            {userOption}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});


// 可编辑的列中的元素
class EditableCell extends PureComponent {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                      rules: [
                          {
                              required: true,
                              message: `请输入 ${title}!`,
                          },
                      ],
                      initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
              restProps.children
              )}
            </td>
          );
          }}
      </EditableContext.Consumer>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ businessAuthModel, loading, authCheckModel, middlewareSystemModel, businessAppModel, accountModel }) => ({
  businessAuthModel,
  authCheckModel,
  middlewareSystemModel,
  businessAppModel,
  accountModel,
  loading: loading.models.businessAuthModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class BusinessAuthList extends PureComponent {
  state = {
    addModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'beAuthUserName',
      title: '用户名',
      dataIndex: 'beAuthUserName',
      width: '15%',
    },
    {
      name: 'businessName',
      title: '业务系统名',
      dataIndex: 'businessName',
      width: '20%',
    },
    {
      name: 'middlewareName',
      title: '中间件系统',
      dataIndex: 'middlewareName',
      width: '20%',
    },
    {
      name: 'authUserName',
      title: '授权者',
      dataIndex: 'authUserName',
      width: '20%',
    },
    {
      name: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
      render: (text, record) => (
        // eslint-disable-next-line radix
        <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      name: 'delete',
      title: '删除',
      dataIndex: 'delete',
      editable: false,
      width: '5%',
      render: (text, row) => (
        <span>
          <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} />
        </span>
      ),
    },
  ];

  // 界面初始化函数
  componentDidMount() {
    const { location, dispatch} = this.props;
    localStorage.setItem('currentPath', location.pathname);
    dispatch({
      type: 'authCheckModel/checkPage',
      payload: {},
    });

    // 获取页面的总个数
    this.getPageData(1);
    // 获取中间件名字列表
    this.getMiddlewareNameList();
    // 获取业务线列表
    this.getBusinessLineList();
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        businessAuthModel: { searchParam, pager },
    } = this.props;

    this.setTableLoading();
    let param = searchParam;
    if (searchParamInput !== undefined) {
      param = searchParamInput;
    }

    let pagerFinal = pager;
    if (pageNo !== undefined) {
      pagerFinal = {
        ...pager,
        pageNo,
      };
    }

    console.log("pager param");
    console.log(JSON.stringify(pagerFinal));
    console.log(JSON.stringify(param));

    // 获取页面的总个数
    dispatch({
      type: 'businessAuthModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'businessAuthModel/pageList',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

  // 获取中间件系统名字列表
  getMiddlewareNameList(){
    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareSystemModel/getMiddlewareNameList',
      payload: {},
    });
  }

  // 获取业务线列表
  getBusinessLineList = () =>{
    const { dispatch } = this.props;

    dispatch({
      type: 'businessLineModel/getBusinessLineList'
    });
  };

  expandedRowRender = record => (
    <div>
      <Row>
        <Col span={6}>
          <Badge status="success" text="创建时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="创建者：" />
          <span>{record.createUserName}</span>
        </Col>
      </Row>
      <br />
    </div>
  );

  showDeleteConfirm = row => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要删除这条配置',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'businessAuthModel/delete',
          payload: {
            id:row.id,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  showAddModal = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  hideAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessAuthModel/setTableLoading',
    });
  };

  // 保存授予中间价系统权限的用户名字
  handleListChange = name =>{
    // console.log("handleListChange");
    // console.log(name);
    const { dispatch } = this.props;
    dispatch({
      type: 'businessAppModel/saveBusinessName',
      payload: name,
    });
  };

  // 名字搜索变更时候用户名字的查询
  handleListSearch = name =>{
    // console.log("handleListSearch");
    // console.log(name);

    if (name === '') {
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'businessAppModel/getBusinessNameList',
      payload: name,
    });

    // 保存本次的数据
    this.handleListChange(name);
  };

// 保存授予中间价系统权限的用户名字
  handleAccountListChange = name =>{
    // console.log("chg");
    // console.log(name);
    const { dispatch } = this.props;
    dispatch({
      type: 'accountModel/saveAccountName',
      payload: name,
    });
  };

// 名字搜索变更时候用户名字的查询
  handleAccountListSearch = name =>{
    // console.log("search");
    // console.log(name);

    if (name === '') {
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'accountModel/getAccountList',
      payload: name,
    });

    // 保存本次的数据
    this.handleAccountListChange(name);
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    this.setTableLoading();

    // 将中间添加的脚本放进去
    const params = {
      ...fields,
      createUserName: userName,
    };

    dispatch({
      type: 'businessAuthModel/add',
      payload: params,
    });

    this.hideAddModal();
  };

  // 判断对象1是否包含对象2的所有属性
  contain = (object1, object2) => {
    let index = 0;
    const keys = Object.keys(object2);
    for (let i = 0; i < keys.length; i += 1) {
      const name = keys[i];
      if (object1[name] && object2[name] === object1[name]) {
        index += 1;
      }
    }
    return index === Object.keys(object2).length;
  };

  handleEdit = fields => {
    const { dispatch } = this.props;
    const { item } = this.state;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    console.log('编辑修改');
    console.log(JSON.stringify(fields));
    console.log(JSON.stringify(item));

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fields)) {
      this.setTableLoading();
      console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userName,
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'businessAuthModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    console.log('启动查询');
    this.setTableLoading();

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.getPageData(1, fieldsValue);
    });
  };

  // 中间件选项变化时候
  onMiddlewareIdSelect= value =>{
    console.log("onMiddlewareIdSelect");
    console.log(value);
    const { form } = this.props;

    console.log('启动查询');
    this.setTableLoading();

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.getPageData(1, {
        ...fieldsValue,
        middlewareId: value
      });
    });
  };

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      middlewareSystemModel: { middlewareNameList },
    } = this.props;

    let nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5} xxl={5}>
            <FormItem label="用户名">
              {getFieldDecorator('beAuthUserName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col lg={7} xxl={5}>
            <FormItem label="中间件系统">
              {getFieldDecorator('middlewareId')(
                <Select
                  allowClear
                  showSearch
                  onSelect={this.onMiddlewareIdSelect}
                  style={{width: '100%'}}
                  placeholder="请选择系统名"
                  optionFilterProp="children"
                >
                  {nameOptions}
                </Select>
               )}
            </FormItem>
          </Col>
          <Col lg={6} xxl={5}>
            <FormItem label="业务系统名">
              {getFieldDecorator('businessName')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={2} xxl={2}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
          <Col lg={2} xxl={2}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  onChange = page => {
    console.log('页面索引修改');

    this.getPageData(page);
  };

  render() {
    const {
       businessAuthModel: { selectState, groupAllCodeList },
      middlewareSystemModel: {middlewareNameList},
    } = this.props;
    const {
      businessAppModel: { businessNameList },
      accountModel: { userAccountList, selectedAccountValue },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { addModalVisible } = this.state;
    const parentAddMethods = {
      selectState,
      groupAllCodeList,
      middlewareNameList,
      businessNameList,
      userAccountList,
      selectedAccountValue,
      handleAccountListSearch: this.handleAccountListSearch,
      handleAccountListChange: this.handleAccountListChange,
      handleListSearch: this.handleListSearch,
      handleListChange: this.handleListChange,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };

    const {
       businessAuthModel: { totalNumber, pager, tableList, tableLoading },
    } = this.props;

    const tableInfo = () => (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <Table
            size="middle"
            rowKey={record => record.id}
            components={components}
            dataSource={tableList}
            columns={this.columns}
            loading={tableLoading}
            pagination={false}
          />
          <br />
          <Pagination
            showQuickJumper
            onChange={this.onChange}
            defaultCurrent={1}
            total={totalNumber}
            current={pager.pageNo}
            defaultPageSize={pager.pageSize}
          />
        </div>
      </Card>
    );

    return (
      <PageHeaderWrapper>
        {tableInfo()}
        <CreateForm {...parentAddMethods} modalVisible={addModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default BusinessAuthList;
