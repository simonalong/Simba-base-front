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
  Tooltip,
  Tag,
  Drawer,
  Icon,
  Transfer,
} from 'antd';

import moment from 'moment';
import styles from './ApplicationList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AppNameSelect from '@/components/AppNameSelect';
import {getUserInfo} from "@/utils/userInfo";

const { RangePicker } = DatePicker;
const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal, searchOc, serverNameList } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  let options;
  if (serverNameList)
    options = serverNameList.map(d => <Select.Option key={d.serverName}>{d.serverName}</Select.Option>);

  return (
    <Modal
      destroyOnClose
      title="添加应用"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideAddModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名(oc)" hasFeedback>
        {form.getFieldDecorator('serverName', {
          rules: [{ required: true, message: '请选择应用名(oc)！' }],
        })(
          <Select
            showSearch
            style={{width: '100%'}}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={searchOc}
            onChange={searchOc}
            notFoundContent={null}
            placeholder="至少输入4个字符搜索"
          >
            {options}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用名(发布平台)" hasFeedback>
        {form.getFieldDecorator('appName', {
          rules: [{ required: true, message: '请选择应用名(发布平台)！' }],
        })(
          <AppNameSelect/>
        )}
      </FormItem>
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, hideEditModal, item, appDetail, onTagEdit, machines, transferData, onTransferChange, onSetTag, onRefreshTag} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  // 表格数据
  const tbData = [];
  tbData.push(item);

  let activeData = {
    serverName: appDetail.serverName,
    activeKey: transferData.activeKey,
    targetKeys: [],
  };

  const onChange = value => {
    activeData.activeKey = value;
    activeData.targetKeys = [];

    if (activeData.activeKey !== 'all') {
      for (let i = 0; i < appDetail.tags.length; i++) {
        if (appDetail.tags[i].tagName === value) {
          for (let j = 0; j < appDetail.tags[i].machines.length; j++) {
            activeData.targetKeys.push(appDetail.tags[i].machines[j].ip);
          }
        }
      }
    }
    onTagEdit(activeData, 'set');
  };

  const operations = [];
  operations.push(<Tooltip placement="topRight" title="新增分组" key="k2"><Button type="primary" icon="plus" onClick={() => onTagEdit(activeData, 'add')} size="small" style={{margin: '0 5px 0 5px'}} /></Tooltip>);
  operations.push(<Tooltip placement="topRight" title="删除分组" key="k3"><Button type="danger" icon="delete" onClick={() => onTagEdit(activeData, 'remove')} size="small" style={{margin: '0 5px 0 5px'}} /></Tooltip>);

  const handleChange = (targetKeys, direction, moveKeys) => {
    onTransferChange(targetKeys, transferData)
  };

  const setBtn = <Tooltip placement="topRight" title="保存" key="k4"><Button type="primary" icon="save" onClick={() => onSetTag(activeData.serverName, transferData)} size="small" style={{margin: '0 5px 0 5px'}} /></Tooltip>;

  return (
    <Drawer
      title="服务分组设置"
      width={1200}
      placement="right"
      closable
      visible={modalVisible}
      maskClosable={false}
      onClose={() => hideEditModal()}
    >
      <Table size="small" dataSource={tbData} pagination={false} bordered={true} rowKey={record => record.serverName}>
        <Table.Column title="应用名(oc)" dataIndex="serverName" key="serverName" width="20%"/>
        <Table.Column title="应用名(发布平台)" dataIndex="appName" key="appName" width="20%"/>
        <Table.Column title="机器总数" dataIndex="totalMachineNum" key="totalMachineNum" width="15%"/>
        <Table.Column title="已分配机器总数" dataIndex="allocatedMachineNum" key="allocatedMachineNum" width="15%" render={(value, row) => {
            return (appDetail.allMachines.length - appDetail.unAllocatedMachines.length)
        }}/>
        <Table.Column title="存在未生效的配置" dataIndex="hasUnEffected" key="hasUnEffected" width="15%" render={(value, row) => {
          if (appDetail.allMachines.length === appDetail.unAllocatedMachines.length)
            return ('');
          if (appDetail.tagEffect === 0)
            return (<Tag color='red'>存在</Tag>);
          else
            return (<Tag color='green'>不存在</Tag>);
        }} />
        <Table.Column title="操作" dataIndex="operation" key="operation" render={(text, row) => (
          <span>
            <Tooltip placement="topRight" title="推送未生效的配置" key="k5">
              <Button type="primary" icon="redo" onClick={() => onRefreshTag(row.serverName)}/>
            </Tooltip>
          </span>
        )}/>
      </Table>


      <Card style={{ width: '100%', marginTop: '50px' }} title="标签分组">
        <Tabs type="card" tabBarStyle={{margin: '0'}} onEdit={onTagEdit} tabBarExtraContent={operations} hideAdd onChange={onChange} activeKey={transferData.activeKey}>
          <Tabs.TabPane tab='未分配' key='all'>
            <Card style={{ width: '100%', borderTop: 'none'}}>
              <Row>
                {appDetail.unAllocatedMachines.map(item => (
                  <Col style={{margin: '0 0 5px 0'}} span={6} key={item.ip}>{item.ip}({item.hostName})</Col>
                ))}
              </Row>
            </Card>
          </Tabs.TabPane>
          {appDetail.tags.map(pane => (
            <Tabs.TabPane tab={pane.tagName} key={pane.tagName} closable="true">
              <Card style={{ width: '100%', borderTop: 'none'}}>
                <Row>
                {pane.machines.map(item => (
                  <Col style={{margin: '0 0 5px 0'}} span={6} key={item.ip}>{item.ip}({item.hostName})</Col>
                ))}
                </Row>
              </Card>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>

      <Card style={{ width: '100%', marginTop: '50px' }} title="标签组设置" extra={setBtn}>
        <Transfer listStyle={{ width: '40%', minHeight: '500px'}}
                  showSearch
                  dataSource={machines}
                  titles={['全部机器列表', `${transferData.rightTitle}`]}
                  disabled={transferData.disabled}
                  onChange={handleChange}
                  targetKeys={transferData.targetKeys}
                  render={item => item.title}
        />
      </Card>
    </Drawer>
  );
});

// 弹窗增加配置项
const TagCreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAddTag, hideAddTagModal, tagNameList, appDetail } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAddTag(fieldsValue);
    });
  };

  let options;
  if (tagNameList)
    options = tagNameList.map(d => <Select.Option key={d.name}>{d.name}</Select.Option>);

  return (
    <Modal
      destroyOnClose
      title="添加标签"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      style={{ top: 200, left: 300 }}
      onCancel={() => hideAddTagModal()}
    >
      {form.getFieldDecorator('serverName', {
        initialValue: `${appDetail.serverName}`
      })(
        <input type="hidden"/>
      )}

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="标签名" hasFeedback>
        {form.getFieldDecorator('tagName', {
          rules: [{ required: true, message: '请选择标签！' }],
        })(
          <Select
            showSearch
            style={{width: '100%'}}
            defaultActiveFirstOption={false}
            filterOption={true}
            notFoundContent={null}
          >
            {options}
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
@connect(({ applicationModel, loading, authCheckModel }) => ({
  applicationModel,
  authCheckModel,
  loading: loading.models.applicationModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class ApplicationList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
    addTagModalVisible: false,
    transferData: {
      serverName: '',
      rightTitle: '',
      activeKey: 'all',
      targetKeys: [],
      disabled: true
    },
};

  columns = [
    {
      name: 'serverName',
      title: '应用名(oc)',
      dataIndex: 'serverName',
      width: '15%',
    },
    {
      name: 'appName',
      title: '应用名(发布系统)',
      dataIndex: 'appName',
      width: '15%',
    },
    {
      name: 'totalMachineNum',
      title: '机器总数',
      dataIndex: 'totalMachineNum',
      width: '8%',
    },
    {
      name: 'allocatedMachineNum',
      title: '已分配机器总数',
      dataIndex: 'allocatedMachineNum',
      width: '8%',
    },
    {
      name: 'status',
      title: '状态',
      dataIndex: 'status',
      width: '8%',
      render: (value, row) => {
        if (row.allocatedMachineNum === 0)
          return (<Tag color='orange'>未配置</Tag>);
        else
          return (<Tag color='green'>已配置</Tag>);
      }
    },
    {
      name: 'hasUnEffected',
      title: '存在未生效的配置',
      dataIndex: 'hasUnEffected',
      width: '8%',
      render: (value, row) => {
        if (row.allocatedMachineNum === 0)
          return ('');
        if (value)
          return (<Tag color='red'>存在</Tag>);
        else
          return (<Tag color='green'>不存在</Tag>);
      }
    },
    {
      name: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: '10%',
    },
    {
      name: 'operation',
      title: '操作',
      dataIndex: 'operation',
      editable: false,
      width: '10%',
      render: (text, row) => {
        let btn = '';
        if (row.allocatedMachineNum > 0) {
          btn =  <Tooltip title="推送未生效的配置" key="b1"><Button type="primary" icon="redo" onClick={() => this.onRefreshTag(row.serverName)} /></Tooltip>;
        } else {
          btn =  <Tooltip title="删除" key="b2"><Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} /></Tooltip>;
        }
        return(
          <span>
          <Button type="primary" icon="edit" onClick={() => this.showEditModal(row)} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            {btn}
        </span>
        )
      },
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
        applicationModel: { searchParam, pager },
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

    dispatch({
      type: 'applicationModel/pageList',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

  expandedRowRender = record => (
    <div>
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
          type: 'applicationModel/delete',
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
    this.getAppDetail(record.serverName);
    this.setState({
      item: record,
      editModalVisible: true,
    });
  };

  hideEditModal = () => {
    this.setState({
      editModalVisible: false,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/tableFresh'
    });
  };

  /************************ 服务分组 **************************/
  searchOc = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/searchOc',
      payload: value
    });
  };

  getAppDetail = serverName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/getAppDetail',
      payload: serverName
    });
  };

  onTagEdit = (activeData, action) => {
    if (action === 'add') {
      this.showAddTagModal();
      return
    }

    if (action === 'remove' && activeData.activeKey !== 'all') {
      const {dispatch} = this.props;
      const showLoading = () => this.setTableLoading();
      const afterTagEdit = (activeData) => this.afterTagEdit(activeData);
      Modal.confirm({
        title: '确定要删除这条配置',
        okText: '确定删除',
        okType: 'danger',
        style: { top: 200, left: 300 },
        cancelText: '取消',
        onOk() {
          showLoading();
          dispatch({
            type: 'applicationModel/removeTag',
            payload: {
              serverName: activeData.serverName,
              tagName: activeData.activeKey
            }
          });
          activeData.activeKey = 'all';
          activeData.targetKeys = [];
          afterTagEdit(activeData);
        },
      });
    }

    this.afterTagEdit(activeData);
  };

  afterTagEdit = activeData => {
    this.setState({
      transferData: {
        activeKey: activeData.activeKey,
        rightTitle: activeData.activeKey === 'all' ? '' : activeData.activeKey,
        disabled: activeData.activeKey === 'all',
        targetKeys: activeData.targetKeys ? activeData.targetKeys : []
      }
    });
  };

  showAddTagModal = () => {
    this.setState({
      addTagModalVisible: true,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/listAllTag',
    });
  };

  hideAddTagModal = () => {
    this.setState({
      addTagModalVisible: false,
    });
  };

  // 添加
  handleAddTag = fields => {
    const { dispatch } = this.props;
    const params = {
      ...fields,
    };

    dispatch({
      type: 'applicationModel/addTag',
      payload: params,
    });

    this.hideAddTagModal();

    // 回显
    let activeData = {
      activeKey: params.tagName,
      targetKeys: [],
    };
    this.afterTagEdit(activeData);
  };

  onTransferChange = (targetKeys, transferData) => {
    this.setState({
      transferData: {
        activeKey: transferData.activeKey,
        rightTitle: transferData.rightTitle,
        disabled: transferData.disabled,
        targetKeys: targetKeys,
      },
    });
  };

  onSetTag = (serverName, transferData) => {
    const { dispatch } = this.props;
    const params = {
      serverName: serverName,
      tagName: transferData.activeKey,
      ips: transferData.targetKeys,
    };

    dispatch({
      type: 'applicationModel/setTag',
      payload: params,
    });
  };

  onRefreshTag = serverName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/refresh',
      payload: {
        serverName
      },
    });
  };

  /************************ 服务分组 **************************/

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'applicationModel/setTableLoading',
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
      type: 'applicationModel/add',
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

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fields)) {
      this.setTableLoading();
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userName,
      };

      dispatch({
        type: 'applicationModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
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
          <Col lg={5}>
            <FormItem label="应用名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" autoComplete="off"/>
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
              添加应用
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
       applicationModel: { selectState, groupAllCodeList, serverNameList, appDetail, tagNameList, appMachines },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { addModalVisible, editModalVisible, item, addTagModalVisible, transferData } = this.state;
    const parentAddMethods = {
      selectState,
      groupAllCodeList,
      serverNameList,
      appDetail,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
      searchOc: this.searchOc,
    };

    /******************* 服务分组 **********************/
    const parentEditMethods = {
      item,
      appDetail,
      transferData,
      machines: appMachines,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
      getAppDetail: this.getAppDetail,
      onTagEdit: this.onTagEdit,
      onTransferChange: this.onTransferChange,
      onSetTag: this.onSetTag,
      onRefreshTag: this.onRefreshTag
    };

    const parentAddTagMethods = {
      selectState,
      groupAllCodeList,
      tagNameList,
      appDetail,
      handleAddTag: this.handleAddTag,
      hideAddTagModal: this.hideAddTagModal,
      searchOc: this.searchOc,
    };
    /******************* 服务分组 **********************/

    const {
       applicationModel: { totalNumber, pager, tableList, tableLoading },
    } = this.props;

    const tableInfo = () => (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <Table
            size="small"
            rowKey={record => record.id}
            components={components}
            dataSource={tableList}
            columns={this.columns}
            loading={tableLoading}
            pagination={false}
            bordered={true}
          />
          <br />
          <Pagination
            showQuickJumper
            onChange={this.onChange}
            defaultCurrent={1}
            total={totalNumber}
            current={pager.pageNo}
            defaultPageSize={pager.pageSize}
            showTotal={total => `共 ${total} 条`}
          />
        </div>
      </Card>
    );

    return (
      <PageHeaderWrapper>
        {tableInfo()}
        <CreateForm {...parentAddMethods} modalVisible={addModalVisible} />
        <EditForm {...parentEditMethods} modalVisible={editModalVisible} />
        <TagCreateForm {...parentAddTagMethods} modalVisible={addTagModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default ApplicationList;
