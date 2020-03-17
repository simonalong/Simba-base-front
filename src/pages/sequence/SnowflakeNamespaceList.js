import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Badge,
  Form,
  Input,
  Button,
  Table,
  Alert,
  Select,
  Pagination,
  InputNumber,
  Modal,
} from 'antd';

import { haveAuthority } from '@/utils/authority';
import moment from 'moment';
import styles from './SnowflakeNamespaceList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

const { TextArea } = Input;
const { Option } = Select;
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

  const nameExistValid = (rule, value, callback) => {
    nameValueCheck(value, callback)
  };

  const modeAlert = () => {
    // 菜单
    if (form.getFieldValue('mode') === "0") {
      return (
        <div>
          <Row>
            <Col offset={1} span={22}>
              <Alert message="local单机模式：适用于超高并发情况，单机QPS可达800w，但是业务集群个数有上限（目前最大2048）" type="info" showIcon banner closable />
            </Col>
          </Row>
          <br />
        </div>
      );
    }
    // 普通按钮和跳转
    if(form.getFieldValue('mode') === "1") {
      return (
        <div>
          <Row>
            <Col offset={1} span={22}>
              <Alert message="distribute分布式模式：适用于高并发情况，QPS为5~80w，集群个数无上限，但是依赖rpc可用性较local低" type="info" showIcon banner closable />
            </Col>
          </Row>
          <br />
        </div>
      );
    }
    return (<span />);
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="命名空间" hasFeedback>
        {form.getFieldDecorator('namespace', {
          rules: [{ required: true, message: '请输入命名空间！' },{
            validator: nameExistValid
          }],
        })(
          <Input placeholder="请输入命名空间" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模式" hasFeedback>
        {form.getFieldDecorator('mode', {
          rules: [{ required: true, message: '请输入模式！' }],
        })(
          <Select
            placeholder="模式"
            style={{width: '100%'}}
          >
            <Option value="0">（local）单机</Option>
            <Option value="1">（distribute）分布式</Option>
          </Select>
        )
        }
      </FormItem>
      {modeAlert()}
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述" hasFeedback>
        {form.getFieldDecorator('desc', {
          rules: [{ required: false, message: '请输入描述！' }],
        })(
          <TextArea
            placeholder="请输入命名空间描述"
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

  let modeStr;
  if(item.mode === 0){
    modeStr = "（local）单机";
  }else{
    modeStr = "（distribute）分布式";
  }

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="命名空间">
        {form.getFieldDecorator('namespace', {
          initialValue: item.namespace,
          rules: [{ required: true, message: '请输入命名空间！' }],
        })(
          <Input placeholder="请输入命名空间" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模式">
        {form.getFieldDecorator('mode', {
          initialValue: modeStr,
        })(
          <Input placeholder="模式" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述">
        {form.getFieldDecorator('desc', {
          initialValue: item.desc,
          rules: [{ required: true, message: '请输入描述！' }],
        })(
          <TextArea
            placeholder="请输入命名空间描述"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
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
@connect(({ snowflakeNamespaceModel, loading, authCheckModel }) => ({
  snowflakeNamespaceModel,
  authCheckModel,
  loading: loading.models.snowflakeNamespaceModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class SnowflakeNamespaceList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'namespace',
      title: '命名空间',
      dataIndex: 'namespace',
      width: '20%',
    },
    {
      name: 'mode',
      title: '模式',
      dataIndex: 'mode',
      width: '10%',
      render: (text) => {
        if (text === 0) {
          return <span>local</span>
        }
        return <span>distribute</span>
      },
    },
    {
      name: 'desc',
      title: '描述',
      dataIndex: 'desc',
      width: '35%',
    },
    {
      name: 'machineNum',
      title: '机器个数',
      dataIndex: 'machineNum',
      width: '10%',
      render: (text) => {
        if (text === 0) {
          return <span />
        }
        return <span>{text}</span>
      },
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
  ];

  // 有权限snowflakeAdmin的人看到的列
  columnsHaveAuth = [
    {
      name: 'namespace',
      title: '命名空间',
      dataIndex: 'namespace',
      width: '30%',
    },
    {
      name: 'mode',
      title: '模式',
      dataIndex: 'mode',
      width: '15%',
      render: (text) => {
        if (text === 0) {
          return <span>local</span>
        }
        return <span>distribute</span>
      },
    },
    {
      name: 'machineNum',
      title: '机器个数',
      dataIndex: 'machineNum',
      width: '15%',
      render: (text) => {
        if (text === 0) {
          return <span />
        }
        return <span>{text}</span>
      },
    },
    {
      name: 'possibleErrNum',
      title: '异常个数',
      dataIndex: 'possibleErrNum',
      width: '15%',
      render: (text) => {
        if (text === 0) {
          return <span />
        }
        return <span>{text}</span>
      },
    },
    {
      name: 'useRatio',
      title: '节点监控',
      dataIndex: 'useRatio',
      width: '15%',
      render: (text, row) => (<Button><Link to={{pathname: '/sequence/SnowflakeNamespaceManager', namespace:row.namespace}}>节点监控</Link></Button>)
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
    localStorage.setItem('appName', "sequence");
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
        snowflakeNamespaceModel: { searchParam, pager },
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
      type: 'snowflakeNamespaceModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'snowflakeNamespaceModel/pageList',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

  expandedRowRender = record => {
    if (haveAuthority("snowflakeAdmin")) {
      return(
        <div>
          <Row>
            <Col span={6}>
              <Badge status="success" text="创建时间：" />
              {/* eslint-disable-next-line radix */}
              <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Col>
            <Col span={6}>
              <Badge status="success" text="更新时间：" />
              {/* eslint-disable-next-line radix */}
              <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Col>
            <Col span={6}>
              <Badge status="success" text="创建者：" />
              <span>{record.createUserName}</span>
            </Col>
            <Col span={6}>
              <Badge status="success" text="更新者：" />
              <span>{record.updateUserName}</span>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={12}>
              <Badge status="success" text="描述：" />
              <span>{record.desc}</span>
            </Col>
          </Row>
        </div>
      );
    }
    return(
      <div>
        <Row>
          <Col span={6}>
            <Badge status="success" text="创建时间：" />
            {/* eslint-disable-next-line radix */}
            <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Col>
          <Col span={6}>
            <Badge status="success" text="更新时间：" />
            {/* eslint-disable-next-line radix */}
            <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Col>
          <Col span={6}>
            <Badge status="success" text="创建者：" />
            <span>{record.createUserName}</span>
          </Col>
          <Col span={6}>
            <Badge status="success" text="更新者：" />
            <span>{record.updateUserName}</span>
          </Col>
        </Row>
        <br />
      </div>
    );
  };

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
          type: 'snowflakeNamespaceModel/delete',
          payload: {
            id:row.namespace,
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

  showEditModal = record => {
    console.log('点击编辑');
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
      type: 'snowflakeNamespaceModel/setTableLoading',
    });
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
      type: 'snowflakeNamespaceModel/add',
      payload: params,
    });

    this.hideAddModal();
  };

  // 名字的核查
  nameValueCheck = (namespace, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'snowflakeNamespaceModel/nameValueCheck',
      payload: {
        namespace,
      },
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
        type: 'snowflakeNamespaceModel/update',
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

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xl={8} xxl={6}>
            <FormItem label="命名空间">
              {getFieldDecorator('namespace')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col xl={6} xxl={5}>
            <FormItem label="模式">
              {getFieldDecorator('mode')(
                <Select
                  allowClear
                  placeholder="模式"
                  style={{width: '100%'}}
                >
                  <Option value="0">（local）单机</Option>
                  <Option value="1">（distribute）分布式</Option>
                </Select>
               )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
          <Col md={2} sm={24}>
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
       snowflakeNamespaceModel: { selectState, groupAllCodeList },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { addModalVisible, editModalVisible, item } = this.state;
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

    const {
       snowflakeNamespaceModel: { totalNumber, pager, tableList, tableLoading },
    } = this.props;


    const tableInfo = () => {
      let columnFinal = this.columns;
      // 权限限制
      if (haveAuthority("snowflakeAdmin")) {
        columnFinal = this.columnsHaveAuth;
      }
      return (
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <Table
              size="middle"
              rowKey={record => record.id}
              components={components}
              dataSource={tableList}
              columns={columnFinal}
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
    };

    return (
      <PageHeaderWrapper>
        {tableInfo()}
        <CreateForm {...parentAddMethods} modalVisible={addModalVisible} />
        <EditForm {...parentEditMethods} modalVisible={editModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default SnowflakeNamespaceList;
