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
  Alert,
  Select,
  DatePicker,
  Pagination,
  InputNumber,
  Tabs,
  Modal,
} from 'antd';
import moment from 'moment';
import { haveAuthority } from '@/utils/authority';
import styles from './JuliaSwitchGroupList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

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
  const { modalVisible, form, handleAdd, hideAddModal, businessLineList, businessNameList, handleListChange, handleListSearch, nameValueCheck } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  // console.log("businessLineList");
  // console.log(JSON.stringify(businessLineList));

  const nameExistValid = (rule, value, callback) => {
    nameValueCheck(value, form.getFieldValue("businessLineId"), callback)
  };

  let businessLineOption;
  if (businessLineList) {
    businessLineOption = businessLineList.map(d => <Select.Option key={d.id}>{d.businessLineName}</Select.Option>);
  }

  let businessNameOption;
  if (businessNameList) {
    businessNameOption = businessNameList.map(d => <Select.Option key={d.name}>{d.name}</Select.Option>);
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="归属业务线" hasFeedback>
        {form.getFieldDecorator('businessLineId', {
          rules: [{ required: true, message: '请输入业务线！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择业务线"
            optionFilterProp="children"
          >
            {businessLineOption}
          </Select>
          )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务名" hasFeedback>
        {form.getFieldDecorator('businessName', {
          rules: [{ required: true, message: '请输入业务名！' }],
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
      <Row>
        <Col offset={1} span={21}>
          <Alert message="业务名若没有，则可用临时的或去oc申请新应用上线：https://oc.ops.yangege.cn/#/app/workflow" type="info" showIcon banner closable />
        </Col>
      </Row>
      <br />
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关组名">
        {form.getFieldDecorator('groupName', {
          rules: [{ required: true, message: '请输入组名，可以与业务名相同！' },{
            validator: nameExistValid
          }],
        })(
          <Input placeholder="请输入组名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="组描述" hasFeedback>
        {form.getFieldDecorator('groupDesc', {
          rules: [{ required: true, message: '请输入组描述！' }],
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
  const { modalVisible, form, handleEdit, hideEditModal, item} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务线">
        {form.getFieldDecorator('businessLineName', {
          initialValue: item.businessLineName,
          rules: [{ required: true, message: '请输入业务线！' }],
        })(
          <Input placeholder="请输入业务线" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名">
        {form.getFieldDecorator('businessName', {
          initialValue: item.businessName,
          rules: [{ required: true, message: '请输入应用名！' }],
        })(
          <Input placeholder="请输入业务线" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关组名">
        {form.getFieldDecorator('groupName', {
          initialValue: item.groupName,
          rules: [{ required: true, message: '请输入组名！' }],
        })(
          <Input placeholder="请输入组名" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="组描述">
        {form.getFieldDecorator('groupDesc', {
          initialValue: item.groupDesc,
          rules: [{ required: true, message: '请输入组描述！' }],
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
@connect(({ juliaSwitchGroupModel, businessLineModel, businessAppModel, loading, authCheckModel, businessAuthModel }) => ({
  juliaSwitchGroupModel,
  businessLineModel,
  businessAppModel,
  authCheckModel,
  businessAuthModel,
  loading: loading.models.juliaSwitchGroupModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class JuliaSwitchGroupList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'groupName',
      title: '开关组名',
      dataIndex: 'groupName',
      width: '15%',
    },
    {
      name: 'groupDesc',
      title: '组描述',
      dataIndex: 'groupDesc',
      width: '30%',
    },
    {
      name: 'businessLineName',
      title: '业务线',
      dataIndex: 'businessLineName',
      width: '20%',
    },
    {
      name: 'businessName',
      title: '业务名',
      dataIndex: 'businessName',
      width: '15%',
    },
    {
      name: 'createUserName',
      title: '创建者',
      dataIndex: 'createUserName',
      width: '10%',
    },
    {
      name: 'edit',
      title: '编辑',
      dataIndex: 'edit',
      width: '5%',
      render: (text, record) => {
        if (haveAuthority("chg_group")) {
          return(
            <span>
              <Button type="primary" icon="edit" onClick={() => this.showEditModal(record)} />
            </span>
          );
        }
        return (
          <span>
            <Button type="primary" icon="edit" onClick={() => this.showEditModal(record)} disabled />
          </span>
        );
      }
    },
    {
      name: 'delete',
      title: '删除',
      dataIndex: 'delete',
      editable: false,
      width: '5%',
      render: (text, row) => {
        if (haveAuthority("delete_group")) {
          return(
            <span>
              <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} />
            </span>
          );
        }
        return (
          <span>
            <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} disabled />
          </span>
        );
      }
    },
  ];

  // 界面初始化函数
  componentDidMount() {
    const { location, dispatch} = this.props;
    localStorage.setItem('currentPath', location.pathname);
    localStorage.setItem('appName', "julia");
    dispatch({
      type: 'authCheckModel/checkPage',
      payload: {},
    });

    // 获取页面的总个数
    this.getPageData(1);

    // 获取业务线列表
    this.getBusinessLineList();
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        juliaSwitchGroupModel: { searchParam, pager },
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
      type: 'juliaSwitchGroupModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'juliaSwitchGroupModel/pageList',
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
          <Badge status="success" text="更新时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="创建人名字：" />
          <span>{record.createUserName}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="更新人名字：" />
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
      title: `注意！！：删除开关组则对应项也会被删除`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'juliaSwitchGroupModel/delete',
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
      type: 'juliaSwitchGroupModel/setTableLoading',
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

  // 名字的核查
  nameValueCheck = (value, businessLineId, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'juliaSwitchGroupModel/nameValueCheck',
      payload: {
        switchGroupName: value,
        businessLineId,
      },
      callback,
    });
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    const userInfo = getUserInfo();

    this.setTableLoading();
    console.log("add group");

    // 将中间添加的脚本放进去
    const params = {
      ...fields,
      createUserName: userInfo.displayName,
    };

    dispatch({
      type: 'juliaSwitchGroupModel/add',
      payload: params,
    });

    console.log("add group");
    dispatch({
      type: 'businessAuthModel/addAuth',
      payload: {
        // 业务名
        businessName: fields.businessName
      },
    });

    this.hideAddModal();
  };

  // 获取业务线列表
  getBusinessLineList = () =>{
    const { dispatch } = this.props;

    dispatch({
      type: 'businessLineModel/getBusinessLineList'
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
      console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userInfo.displayName,
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'juliaSwitchGroupModel/update',
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

    const {
      businessLineModel: { businessLineList },
    } = this.props;

    let businessLineOption;
    if (businessLineList) {
      businessLineOption = businessLineList.map(d => <Select.Option key={d.id}>{d.businessLineName}</Select.Option>);
    }

    // eslint-disable-next-line consistent-return
    const addModel = () => {
      if (haveAuthority("add_group")) {
        return(
          <Col md={2} sm={24}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新建
            </Button>
          </Col>
        );
      }
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="业务线">
              {getFieldDecorator('businessLineId')(
                <Select
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  placeholder="请选择业务线"
                  optionFilterProp="children"
                >
                  {businessLineOption}
                </Select>
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="开关组名">
              {getFieldDecorator('groupName')(
                <Input placeholder="请输入" />
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
          {addModel()}
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
       juliaSwitchGroupModel: { selectState },
    } = this.props;

    const {
      businessLineModel: { businessLineList },
    } = this.props;
    const {
      businessAppModel: { businessNameList },
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
      businessLineList,
      businessNameList,
      nameValueCheck: this.nameValueCheck,
      handleListSearch: this.handleListSearch,
      handleListChange: this.handleListChange,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };

    const {
       juliaSwitchGroupModel: { totalNumber, pager, tableList, tableLoading },
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
      </PageHeaderWrapper>
    );
  }
}

export default JuliaSwitchGroupList;
