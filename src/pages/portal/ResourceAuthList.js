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
  Select,
  Drawer,
  Transfer,
  Pagination,
  Icon,
  InputNumber,
  Tabs,
  Modal,
  Divider,
} from 'antd';

import moment from 'moment';
import styles from './ResourceAuthList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

const { Option } = Select;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1582638_2bpz81tar7c.js',
});

const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal, middlewareNameList, userAccountList, selectedAccountValue, handleAccountListChange, handleAccountListSearch } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  let userOption;
  if(userAccountList){
    userOption = userAccountList.map(d => <Select.Option key={d.cn}>{d.cn}-{d.displayName}</Select.Option>);
  }

  let nameOptions;
  if(middlewareNameList){
    nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="被授予人" hasFeedback>
        {form.getFieldDecorator('userName', {
          initialValue: selectedAccountValue,
          rules: [{ required: true, message: '请输入被授予人！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择用户名"
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

  return (
    <Modal
      destroyOnClose
      title="修改"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="中间件系统的id">
        {form.getFieldDecorator('middlewareId', {
          initialValue: item.middlewareId,
          rules: [{ required: true, message: '请输入中间件系统的id！' }],
        })(
          <Input placeholder="请输入中间件系统的id" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="被授予人">
        {form.getFieldDecorator('userName', {
          initialValue: item.userName,
          rules: [{ required: true, message: '请输入被授予人！' }],
        })(
          <Input placeholder="请输入被授予人" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="资源组id">
        {form.getFieldDecorator('resourceGroupId', {
          initialValue: item.resourceGroupId,
          rules: [{ required: true, message: '请输入资源组id！' }],
        })(
          <Input placeholder="请输入资源组id"  />
        )}
      </FormItem>
    </Modal>
  );
});

const AuthForm = Form.create()(props => {
  const {
    transferVisible,
    form,
    submitDrawAuth,
    selectedKeys,
    middlewareNameList,
    userAccountList,
    allResourceList,
    haveResourceList,
    hideDraw,
    selectSystemResource,
    drawHandleChange,
    drawHandleSelectChange,
    drawHandleScroll,
    handleAccountListSearch,
    handleAccountListChange,
    handleAccountListSelect,
  } = props;

  // console.log("allResourceList list");
  // console.log(JSON.stringify(allResourceList));
  // console.log(JSON.stringify(haveResourceList));
  // console.log(JSON.stringify(selectedKeys));

  const allItem = [];
  for (let index = 0; index < allResourceList.length; index += 1) {
    const resourceItem = allResourceList[index];
    let resourceTypeStr = "resource";
    if(resourceItem.resourceType === 0){
      resourceTypeStr = "menu";
    }
    allItem.push({
      key: resourceItem.resourceId,
      title: `${resourceItem.resourceName} : [${resourceTypeStr}] : ${resourceItem.resourceDesc}`,
      description: resourceItem.resourceDesc,
    });
  }

  // console.log("allItem");
  // console.log(JSON.stringify(allItem));

  let nameOptions;
  if(middlewareNameList){
    nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
  }

  let userOption;
  if(userAccountList){
    userOption = userAccountList.map(d => <Select.Option key={d.cn}>{d.cn}-{d.displayName}</Select.Option>);
  }

  // 提交右侧设置的系统用户授权
  const onSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submitDrawAuth(values);
        form.resetFields();
      }
    });
  };

  return (
    <Drawer
      title="资源授权"
      width={1200}
      placement="right"
      closable
      onClose={hideDraw}
      visible={transferVisible}
    >
      <FormItem labelCol={{span: 3}} wrapperCol={{span: 19}} label="中间件系统">
        {form.getFieldDecorator('drawMiddlewareId', {
          rules: [{required: true, message: '请输入中间件系统！'}],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择中间件系统"
            optionFilterProp="children"
            onSelect={selectSystemResource}
          >
            {nameOptions}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{span: 3}} wrapperCol={{span: 19}} label="被授权人">
        {form.getFieldDecorator('drawUserName', {
          rules: [{required: true, message: '请输入被授权人！'}],
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
            onSelect={handleAccountListSelect}
            notFoundContent={null}
          >
            {userOption}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{span: 2}} wrapperCol={{span: 22}} label="资源">
        {form.getFieldDecorator('authResourceList')(
          <Transfer
            dataSource={allItem}
            titles={['所有资源', '拥有资源']}
            listStyle={{
              width: '45%',
              height: 420,
            }}
            showSearch
            targetKeys={haveResourceList}
            selectedKeys={selectedKeys}
            onChange={drawHandleChange}
            onSelectChange={drawHandleSelectChange}
            onScroll={drawHandleScroll}
            render={item => item.title}
            onSearch={drawHandleScroll}
          />
        )}
      </FormItem>
      <FormItem>
        <div>
          <Divider />
          <Button onClick={hideDraw} style={{marginLeft: 70}}>
            取消
          </Button>
          <Button type="primary" onClick={onSubmit} style={{marginLeft: 80}}>
            提交
          </Button>
        </div>
      </FormItem>
    </Drawer>
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
@connect(({ resourceAuthModel, middlewareSystemModel, middlewareResourceGroupModel, authCheckModel, accountModel, loading }) => ({
  resourceAuthModel,
  middlewareSystemModel,
  authCheckModel,
  accountModel,
  middlewareResourceGroupModel,
  loading: loading.models.resourceAuthModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class ResourceAuthList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},

    selectedUser: null, // 选择授予的用户
    selectedMiddlewareId: null, // 选择的中间件系统
    // 资源组和资源关联弹窗
    transferVisible: false,
    // 资源组和资源关联选择的key
    selectedKeys: [],
  };

  columns = [
    {
      name: 'userName',
      title: '用户名',
      dataIndex: 'userName',
      width: '10%',
    },
    {
      name: 'middlewareName',
      title: '中间件系统',
      dataIndex: 'middlewareName',
      width: '10%',
    },
    {
      name: 'resourceName',
      title: '资源名',
      dataIndex: 'resourceName',
      width: '13%',
    },
    {
      name: 'resourceType',
      title: '类型',
      dataIndex: 'resourceType',
      width: '5%',
      render: (text) => {
        if(text === 0){
          return (<IconFont type="icon-caidan1" style={{ fontSize: '25px' }} />);
        }
        return (<IconFont type="icon-qianbao2" style={{ fontSize: '25px' }} />);
      }
    },
    {
      name: 'resourceDesc',
      title: '描述',
      dataIndex: 'resourceDesc',
      width: '30%',
    },
    {
      name: 'resourceUrl',
      title: '后端url',
      dataIndex: 'resourceUrl',
      width: '20%',
    },
    {
      name: 'createUserName',
      title: '授权者',
      dataIndex: 'createUserName',
      width: '10%',
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
    this.getMiddlewareNameList();
    this.getResourceGroupList();
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        resourceAuthModel: { searchParam, pager },
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
      type: 'resourceAuthModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'resourceAuthModel/pageList',
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

  // 获取资源组id列表
  getResourceGroupList =() =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareResourceGroupModel/getResourceGroupList',
      payload: {},
    });
  };

  expandedRowRender = record => (
    <div>
      <Row>
        <Col span={6}>
          <Badge status="success" text="更新时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="更新人：" />
          <span>{record.updateUserName}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="授权者：" />
          <span>{record.createUserName}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="创建时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
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
      title: '确定要删除这条配置',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'resourceAuthModel/delete',
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
      type: 'resourceAuthModel/setTableLoading',
    });
  };

  // 保存授予中间价系统权限的用户名字
  handleAccountListChange = name =>{
    // console.log("chg");
    // console.log(name);
    const { dispatch } = this.props;
    this.setState({selectedUser: name});

    dispatch({
      type: 'accountModel/saveAccountName',
      payload: name,
    });
  };

  // 用户选择之后
  handleAccountListSelect = item => {
    // console.log("handleAccountListSelect");
    // console.log(JSON.stringify(item));
    const { dispatch } = this.props;
    const { selectedMiddlewareId } = this.state;
    const userInfo = getUserInfo();

    // 中间件不空，则获取当前用户的数据
    if (selectedMiddlewareId != null) {
      dispatch({
        type: 'resourceAuthModel/getResourceListByUserAndMiddlewareId',
        payload: {
          userName: userInfo.displayName,
          middlewareId: selectedMiddlewareId,
          sendType: 1
        },
      });
    }

    // 被授权用户名不空，则刷新用户的资源
    if (item != null) {
      dispatch({
        type: 'resourceAuthModel/getResourceListByUserAndMiddlewareId',
        payload: {
          userName: item,
          middlewareId: selectedMiddlewareId,
          sendType: 2
        },
      });
    }
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

    this.setTableLoading();

    // 将中间添加的脚本放进去
    const params = {
      ...fields,
      createUserName: userInfo.displayName,
    };

    dispatch({
      type: 'resourceAuthModel/add',
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
        type: 'resourceAuthModel/update',
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
      middlewareSystemModel: { middlewareNameList },
    } = this.props;
    // const {
    //   middlewareResourceGroupModel: { resourceGroupList },
    // } = this.props;

    let nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }

    // let groupOptions;
    // if(resourceGroupList){
    //   groupOptions = resourceGroupList.map(d => <Select.Option key={d.id}>{d.groupName}</Select.Option>);
    // }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={4} xxl={4}>
            <FormItem label="用户">
              {getFieldDecorator('userName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col lg={5} xxl={4}>
            <FormItem label="资源名">
              {getFieldDecorator('resourceName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col lg={6} xxl={6}>
            <FormItem label="中间件">
              {getFieldDecorator('middlewareId')(
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
          </Col>
          <Col lg={5} xxl={4}>
            <FormItem label="资源类型">
              {getFieldDecorator('resourceType')(
                <Select
                  allowClear
                  placeholder="资源类型"
                  style={{width: '100%'}}
                >
                  <Option value="0">菜单</Option>
                  <Option value="1">资源</Option>
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
            <Button type="primary" onClick={this.showDraw}>
              授权
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

  // 展示资源组和资源关联
  showDraw = () => {
    this.setState({
      transferVisible: true,
    });
    this.cleanResource();
  };

  // 关闭资源组与资源的关联匹配抽屉
  hideDraw = () => {
    this.setState({
      transferVisible: false,
      item: {},
      selectedKeys: [],
      selectedUser: null,
      selectedMiddlewareId: null,
    });

    this.cleanResource();
  };

  // 清理弹窗时候的资源展示
  cleanResource=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceAuthModel/cleanResourceList',
      payload: {},
    });

    this.setState({
      selectedUser: null,
      selectedMiddlewareId: null,
      selectedKeys: [],
    });
  };

  // 获取指定中间件系统对应的系统资源
  selectSystemResource = middlewareId =>{
    console.log("selectSystemResource value");
    console.log(JSON.stringify(middlewareId));
    const { dispatch } = this.props;
    const { selectedUser } = this.state;

    this.setState({
      selectedMiddlewareId: middlewareId,
    });

    console.log("chg middlewareId ", middlewareId);

    const userInfo = getUserInfo();

    dispatch({
      type: 'resourceAuthModel/getResourceListByUserAndMiddlewareId',
      payload: {
        userName: userInfo.displayName,
        middlewareId,
        sendType: 1
      },
    });

    // 如果用户选择了，则也进行刷新
    if(selectedUser != null){
      dispatch({
        type: 'resourceAuthModel/getResourceListByUserAndMiddlewareId',
        payload: {
          userName: selectedUser,
          middlewareId,
          sendType: 2
        },
      });
    }
  };

  // 选择中间件系统
  handleMiddlewareChg = middlewareId =>{
    console.log("handleMiddlewareChg value");
    console.log(JSON.stringify(middlewareId));
  };

  drawHandleChange=(nextTargetKeys) => {
    const{dispatch} = this.props;
    console.log("drawHandleChange");
    console.log(JSON.stringify(nextTargetKeys));
    dispatch({
      type: 'resourceAuthModel/updateTargetKeys',
      payload: nextTargetKeys
    });
  };

  drawHandleSelectChange=(sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    console.log("drawHandleSelectChange");
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  drawHandleScroll= (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  // 提交右侧弹窗的数据
  submitDrawAuth=(values)=>{
    console.log("submitDrawAuth 提交的数据");
    console.log(JSON.stringify(values));
    const { dispatch } = this.props;
    const {
      resourceAuthModel: { haveResourceList},
    } = this.props;
    const userInfo = getUserInfo();

    // const resourceIdList = [];
    //
    // for (let index = 0; index < values.authResourceList.length; index += 1) {
    //   resourceIdList.push(values.authResourceList[index].id);
    // }

    console.log("haveResourceList 提交的数据");
    console.log(JSON.stringify(haveResourceList));

    dispatch({
      type: 'resourceAuthModel/add',
      payload: {
        middlewareId: values.drawMiddlewareId,
        authorizedUserName: values.drawUserName,
        resourceIdList: haveResourceList,
        createUserName: userInfo.displayName,
      },
    });

    this.hideDraw();
  };

  render() {
    const {
      resourceAuthModel: {selectState, groupAllCodeList, allResourceList, haveResourceList, totalNumber, pager, tableList, tableLoading},
      accountModel: {userAccountList, selectedAccountValue},
      middlewareSystemModel: {middlewareNameList},
    } = this.props;

    const {
      transferVisible,
      selectedKeys,
      addModalVisible,
      editModalVisible,
      item
    } = this.state;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const parentAddMethods = {
      selectState,
      groupAllCodeList,
      middlewareNameList,
      userAccountList,
      selectedAccountValue,
      handleAccountListSearch: this.handleAccountListSearch,
      handleAccountListChange: this.handleAccountListChange,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };
    const parentAuthMethods = {
      selectedKeys,
      middlewareNameList,
      userAccountList,
      allResourceList,
      haveResourceList,
      hideDraw: this.hideDraw,
      submitDrawAuth: this.submitDrawAuth,
      selectSystemResource: this.selectSystemResource,
      handleMiddlewareChg: this.handleMiddlewareChg,
      drawHandleChange: this.drawHandleChange,
      drawHandleSelectChange: this.drawHandleSelectChange,
      drawHandleScroll: this.drawHandleScroll,
      handleAccountListSearch: this.handleAccountListSearch,
      handleAccountListChange: this.handleAccountListChange,
      handleAccountListSelect: this.handleAccountListSelect,
    };

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
        <AuthForm {...parentAuthMethods} transferVisible={transferVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default ResourceAuthList;
