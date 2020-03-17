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
  Icon,
  Pagination,
  InputNumber,
  Tabs,
  Modal,
} from 'antd';

import moment from 'moment';
import styles from './MiddlewareSystemList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

// 引入js
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1022745_kgkvftiewc.js',
});
const { TextArea } = Input;
const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal, nameValueCheck } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const nameExistValid = (rule, value, callback)=>{
    nameValueCheck(form.getFieldValue("middlewareName"), callback)
  };

  return (
    <Modal
      destroyOnClose
      title="新增"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideAddModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统名字" hasFeedback>
        {form.getFieldDecorator('middlewareName', {
          rules: [{ required: true, message: '请输入系统名字！' },{
            validator: nameExistValid
          }],
        })(
          <Input placeholder="请输入系统名字" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统别名" hasFeedback>
        {form.getFieldDecorator('middlewareAlias', {
          rules: [{ required: true, message: '请输入系统别名！' }],
        })(
          <Input placeholder="请输入系统别名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统host" hasFeedback>
        {form.getFieldDecorator('middlewareHost', {
          rules: [{ required: true, message: '请输入系统host！' }],
        })(
          <Input placeholder="请输入系统host" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统描述" hasFeedback>
        {form.getFieldDecorator('middlewareDesc', {
          rules: [{ required: true, message: '请输入系统描述！' }],
        })(
          <TextArea
            placeholder="请输入系统描述"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
          )}
      </FormItem>
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, hideEditModal, item } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const systemHost=()=>{
    if(item.middlewareName === 'portal'){
      return (<span />);
    }

    // eslint-disable-next-line no-undef
    if (PORTAL_ENV === 'debug') {
      // eslint-disable-next-line no-undef
      if(item.debugStatus === 1){
        return (
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统host">
            {form.getFieldDecorator('debugHost', {
              initialValue: item.debugHost,
              rules: [{ required: true, message: '请输入系统host！' }],
            })(
              <Input placeholder="请输入系统host"  />
            )}
          </FormItem>
        );
      }
    }
    return (
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统host">
        {form.getFieldDecorator('middlewareHost', {
          initialValue: item.middlewareHost,
          rules: [{ required: true, message: '请输入系统host！' }],
        })(
          <Input placeholder="请输入系统host"  />
        )}
      </FormItem>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统名字">
        {form.getFieldDecorator('middlewareName', {
          initialValue: item.middlewareName,
          rules: [{ required: true, message: '请输入系统名字！' }],
        })(
          <Input placeholder="请输入系统名字" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统别名">
        {form.getFieldDecorator('middlewareAlias', {
          initialValue: item.middlewareAlias,
          rules: [{ required: true, message: '请输入系统别名！' }],
        })(
          <Input placeholder="请输入系统别名"  />
        )}
      </FormItem>
      {systemHost()}
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="系统描述">
        {form.getFieldDecorator('middlewareDesc', {
          initialValue: item.middlewareDesc,
          rules: [{ required: true, message: '请输入系统描述！' }],
        })(
          <TextArea
            placeholder="请输入系统描述"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        )}
      </FormItem>
    </Modal>
  );
});

// 弹窗增加配置项
const DebugForm = Form.create()(prop => {
  const { modalVisible, form, handleDebug, hideModal, item } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleDebug(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="调试"
      visible={modalVisible}
      onOk={okHandle}
      okText="启动调试"
      maskClosable={false}
      onCancel={() => hideModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="debugHost">
        {form.getFieldDecorator('debugHost', {
          initialValue: item.debugHost,
          rules: [{ required: true, message: '请输入调试的host！' }],
        })(
          <Input placeholder="请输入调试的host" />
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
@connect(({ middlewareSystemModel, authCheckModel, loading }) => ({
  middlewareSystemModel,
  authCheckModel,
  loading: loading.models.middlewareSystemModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class MiddlewareSystemList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
    debugItem: {},
    debugModalVisible: false,
  };

  columns = [
    {
      name: 'middlewareName',
      title: '系统名字',
      dataIndex: 'middlewareName',
      width: '10%',
    },
    {
      name: 'middlewareAlias',
      title: '系统别名',
      dataIndex: 'middlewareAlias',
      width: '10%',
    },
    {
      name: 'middlewareHost',
      title: '系统Host',
      dataIndex: 'middlewareHost',
      width: '30%',
      render: (text, record) =>{
        if (text === 'portal') {
          return (<span />);
        }
        // eslint-disable-next-line no-undef
        if (PORTAL_ENV === 'debug') {
          // eslint-disable-next-line no-undef
          if(record.debugStatus === 1){
            return (
              <span>
                <span>{record.debugHost}</span>
              </span>
            );
          }
        }
        return (<span>{text}</span>);
      }
    },
    {
      name: 'middlewareDesc',
      title: '系统描述',
      dataIndex: 'middlewareDesc',
      width: '25%',
    },
    {
      name: 'createUserName',
      title: '创建人',
      dataIndex: 'createUserName',
      width: '10%',
    },
    {
      name: 'debugStatus',
      title: '调试',
      dataIndex: 'debugStatus',
      width: '5%',
      render: (text, record) =>{
        // eslint-disable-next-line no-undef
        // 如果portal，则无
        if(record.middlewareName === "portal"){
          return (<span />);
        }

        // 本地环境，全部绿色
        // eslint-disable-next-line no-undef
        if (PORTAL_ENV === 'debug') {
          // 静止
          if (text === 0) {
            return (
              <span>
                <IconFont type="icon-bug" style={{fontSize: '25px'}} onClick={() => this.showDebugModal(record)} />
              </span>
            );
          }
          // 转动
          return (
            <span>
              <IconFont type="icon-setting" style={{fontSize: '25px'}} spin onClick={() => this.debugStop(record)} />
            </span>
          );
        }
        // 其他环境，全部灰色
        // 静止
        if (text === 0) {
          return (
            <span>
              <IconFont type="icon-bug-copy" style={{fontSize: '25px'}} />
            </span>
          );
        }
        // 转动
        return (
          <span>
            <IconFont type="icon-setting-gray" style={{fontSize: '25px'}} spin />
          </span>
        );
      }
    },
    {
      name: 'edit',
      title: '编辑',
      dataIndex: 'edit',
      width: '5%',
      render: (text, record) => (
        <span>
          <Button type="primary" icon="edit" onClick={() => this.showEditModal(record)} />
        </span>
      ),
    },
    {
      name: 'delete',
      title: '删除',
      dataIndex: 'delete',
      editable: false,
      width: '5%',
      render: (text, row) => {
        if (row.middlewareName === 'portal') {
          return (
            <span>
              <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} disabled />
            </span>
          );
        }
        return (
          <span>
            <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} />
          </span>
        );
      }
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
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        middlewareSystemModel: { searchParam, pager },
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
      type: 'middlewareSystemModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'middlewareSystemModel/pageList',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

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
        <Col span={6}>
          <Badge status="success" text="更新时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="更新人：" />
          <span>{record.updateUserName}</span>
        </Col>
      </Row>
      <br />
    </div>
  );

  showDeleteConfirm = row => {
    const { dispatch } = this.props;
    console.log('点击');
    console.log(JSON.stringify(row));
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '重要告警：！！！！！！！！！！！！！！删除配置，则对应的资源及授权也都会删除',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'middlewareSystemModel/delete',
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

  showDebugModal = record =>{
    this.setState({
      debugItem: record,
      debugModalVisible: true,
    });
  };

  hideDebugModal = () =>{
    this.setState({
      debugItem: {},
      debugModalVisible: false,
    });
  };

  showEditModal = record => {
    // console.log('点击编辑');
    this.setState({
      item: record,
      editModalVisible: true,
    });
  };

  hideEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
  };

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareSystemModel/setTableLoading',
    });
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    const userInfo = getUserInfo();

    this.setTableLoading();

    // 将中间添加的脚本放进去
    const params = {
      ...fields,
      createUserName: userInfo.displayName,
    };

    dispatch({
      type: 'middlewareSystemModel/add',
      payload: params,
    });

    this.hideAddModal();
  };

  nameValueCheck = (value, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'middlewareSystemModel/nameValueCheck',
      payload: value,
      callback,
    });
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

    console.log('编辑修改');
    console.log(JSON.stringify(fields));
    console.log(JSON.stringify(item));

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fields)) {
      this.setTableLoading();
      // console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userInfo.displayName,
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'middlewareSystemModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  // 处理debug
  handleDebug = fields =>{
    const { dispatch } = this.props;
    const { debugItem } = this.state;
    const userInfo = getUserInfo();

    console.log('debug');
    console.log(JSON.stringify(fields));

    this.setTableLoading();
    // console.log('有变化需要修改');
    const params = {
      ...Object.assign(debugItem, fields),
      updateUserName: userInfo.displayName,
    };

    dispatch({
      type: 'middlewareSystemModel/debugRun',
      payload: params,
    });

    this.hideDebugModal();
  };

  // 处理debug
  debugStop = fields =>{
    const { dispatch } = this.props;
    const { debugItem } = this.state;

    console.log('编辑修改');
    console.log(JSON.stringify(fields));

    this.setTableLoading();
    // console.log('有变化需要修改');
    const params = {
      ...Object.assign(debugItem, fields),
    };

    dispatch({
      type: 'middlewareSystemModel/debugStop',
      payload: params,
    });

    this.hideDebugModal();
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

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, xxl: 48 }}>
          <Col lg={7} xxl={5}>
            <FormItem label="系统名字">
              {getFieldDecorator('middlewareName')(
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
       middlewareSystemModel: { selectState, groupAllCodeList },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { addModalVisible, editModalVisible, debugModalVisible, item } = this.state;
    const parentAddMethods = {
      selectState,
      groupAllCodeList,
      nameValueCheck: this.nameValueCheck,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };
    const parentDebugMethods = {
      item,
      handleDebug: this.handleDebug,
      hideModal: this.hideDebugModal,
    };

    const {
       middlewareSystemModel: { totalNumber, pager, tableList, tableLoading },
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
            expandedRowRender={this.expandedRowRender}
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
        <EditForm {...parentEditMethods} modalVisible={editModalVisible} />
        <DebugForm {...parentDebugMethods} modalVisible={debugModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default MiddlewareSystemList;
