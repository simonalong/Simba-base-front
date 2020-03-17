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
  Icon,
  Tooltip,
  Drawer,
  Divider,
  Pagination,
  InputNumber,
  Tabs,
  Modal,
} from 'antd';

import moment from 'moment';
import styles from './MiddlewareResourceItemList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";

const ButtonGroup = Button.Group;
const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();
const FormItem = Form.Item;
const EditableFormRow = Form.create()(({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
));

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1582638_2bpz81tar7c.js',
});

// 弹窗增加配置项
const CreateForm = Form.create()(prop => {
  const { modalVisible, form, handleAdd, hideAddModal, middlewareNameList, nameValueCheck } = prop;

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

  const nameExistValid = (rule, value, callback) => {
    nameValueCheck(value, form.getFieldValue("middlewareId"), form.getFieldValue("resourceType"), callback)
  };

  const resourceUrl = () => {
    // 菜单
    if (form.getFieldValue('resourceType') === "0") {
      return (
        <FormItem labelCol={{span: 6}} wrapperCol={{span: 17}} label="菜单path">
          {form.getFieldDecorator('resourceUrl', {
            rules: [{ required: true, message: '请输入菜单path' }],
          })(
            <Input placeholder="必须为：router.config.js菜单的pah：/xxxx/xxx" />
          )}
        </FormItem>
      );
    }
    // 普通按钮
    if(form.getFieldValue('resourceType') === "1") {
      return (
        <FormItem labelCol={{span: 6}} wrapperCol={{span: 17}} label="后端url">
          {form.getFieldDecorator('resourceUrl')(
            <Input placeholder="后端url：/xx/xx，多个url可以逗号隔开" />
          )}
        </FormItem>
      );
    }
    return (<span />);
  };

  const resourceName = () => {
    // 菜单
    if (form.getFieldValue('resourceType') === "0") {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="权限（资源）名">
          {form.getFieldDecorator('resourceName', {
            rules: [{ required: true, message: '请输入权限名！' },{
              validator: nameExistValid
            }],
          })(
            <Input placeholder="必须为：router.config.js中的authority" />)}
        </FormItem>
      );
    }
    // 普通按钮和跳转
    if(form.getFieldValue('resourceType') === "1") {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="资源名">
          {form.getFieldDecorator('resourceName', {
            rules: [{ required: true, message: '请输入资源名！' }],
          })(
            <Input placeholder="请输入资源名" />)}
        </FormItem>
      );
    }
    return (<span />);
  };

  const resourceDesc = () => {
    // 菜单
    if (form.getFieldValue('resourceType') === "0") {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="描述">
          {form.getFieldDecorator('resourceDesc', {
            rules: [{ required: true, message: '请输入系统描述' }],
          })(
            <TextArea
              placeholder="建议：输入菜单的中文名字，如果有父目录，建议：父菜单名 - 子菜单名"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          )}
        </FormItem>
      );
    }
    // 普通按钮和跳转
    if(form.getFieldValue('resourceType') === "1") {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="简述">
          {form.getFieldDecorator('resourceDesc', {
            rules: [{ required: true, message: '请输入系统描述' }],
          })(
            <TextArea
              placeholder="请输入该资源针对的简述，请简短些"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          )}
        </FormItem>
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="中间件系统">
        {form.getFieldDecorator('middlewareId', {
          rules: [{ required: true, message: '请输入中间件系统的id！' }],
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="资源类型">
        {form.getFieldDecorator('resourceType', {
          rules: [{ required: true, message: '请输入资源类型' }],
        })(
          <Select
            placeholder="资源类型"
            style={{width: '100%'}}
          >
            <Option value="0">菜单</Option>
            <Option value="1">资源</Option>
          </Select>
        )}
      </FormItem>
      {resourceName()}
      {resourceUrl()}
      {resourceDesc()}
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

  let resourceTypeStr;
  if(item.resourceType === 0){
    resourceTypeStr = "菜单";
  }else{
    resourceTypeStr = "资源";
  }

  const backUrl = () => {
    // 菜单
    if (item.resourceType === 0) {
      return (
        <FormItem labelCol={{span: 6}} wrapperCol={{span: 17}} label="菜单path">
          {form.getFieldDecorator('resourceUrl', {
            initialValue: item.resourceUrl,
            rules: [{required: true, message: '请输入菜单的路由path！'}],
          })(
            <Input placeholder="必须为：router.config.js菜单的pah：/xxxx/xxx" />
          )}
        </FormItem>
      );
    }
    // 普通按钮和跳转
    if (item.resourceType === 1) {
      return (
        <FormItem labelCol={{span: 6}} wrapperCol={{span: 17}} label="后端url">
          {form.getFieldDecorator('resourceUrl', {
            initialValue: item.resourceUrl,
            rules: [{required: true, message: '请输入后端url！'}],
          })(
            <Input placeholder="后端url：/platform/appName/xx/xx" />
          )}
        </FormItem>
      );
    }
    return (<span />);
  };

  const resourceName = () => {
    // 菜单
    if (item.resourceType === 0) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="权限名">
          {form.getFieldDecorator('resourceName', {
              initialValue: item.resourceName,
              rules: [{ required: true, message: '请输入权限名！' }],
            })(
              <Input placeholder="必须为：router.config.js中的authority" disabled />
            )}
        </FormItem>
      );
    }
    // 普通按钮和跳转
    if (item.resourceType === 1) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="资源名">
          {form.getFieldDecorator('resourceName', {
            initialValue: item.resourceName,
              rules: [{ required: true, message: '请输入资源名！' }],
          })(
            <Input placeholder="请输入资源名" disabled />
          )}
        </FormItem>
      );
    }
    return (<span />);
  };

  const resourceDesc = () => {
    // 菜单
    if (item.resourceType === 0) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="描述">
          {form.getFieldDecorator('resourceDesc', {
              initialValue: item.resourceDesc,
              rules: [{ required: true, message: '请输入描述！' }],
            })(
              <TextArea
                placeholder="建议：输入菜单的中文名字，如果有父目录，建议：父菜单名 - 子菜单名"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            )}
        </FormItem>
      );
    }
    // 普通按钮和跳转
    if (item.resourceType === 1) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="描述">
          {form.getFieldDecorator('resourceDesc', {
            initialValue: item.resourceDesc,
            rules: [{ required: true, message: '请输入描述！' }],
          })(
            <TextArea
              placeholder="请输入系统描述"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          )}
        </FormItem>
      );
    }
    return (<span />);
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="中间件系统">
        {form.getFieldDecorator('middlewareName', {
          initialValue: item.middlewareName,
          rules: [{ required: true, message: '请输入中间件系统的id！' }],
        })(
          <Input placeholder="请输入中间件系统的id" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} label="资源类型">
        {form.getFieldDecorator('resourceType', {
          initialValue: resourceTypeStr,
          rules: [{ required: true, message: '请输入资源类型' }],
        })(
          <Input placeholder="请输入资源名" disabled />
        )}
      </FormItem>
      {resourceName()}
      {backUrl()}
      {resourceDesc()}
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
@connect(({ middlewareResourceItemModel, middlewareSystemModel, authCheckModel, loading }) => ({
  middlewareResourceItemModel,
  middlewareSystemModel,
  authCheckModel,
  loading: loading.models.middlewareResourceItemModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class MiddlewareResourceItemList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
    // 资源导出弹窗可见性
    downLoadVisible: false,
    // 资源导入弹窗可见性
    uploadVisible: false
  };

  columns = [
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
      width: '15%',
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
      name: 'resourceUrl',
      title: '后端url',
      dataIndex: 'resourceUrl',
      width: '25%',
    },
    {
      name: 'resourceDesc',
      title: '描述',
      dataIndex: 'resourceDesc',
      width: '25%',
    },
    {
      name: 'createUserName',
      title: '创建人',
      dataIndex: 'createUserName',
      width: '10%',
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
    dispatch({
      type: 'authCheckModel/checkPage',
      payload: {},
    });

    // 获取页面的总个数
    this.getPageData(1);
    this.getMiddlewareNameList();
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        middlewareResourceItemModel: { searchParam, pager },
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
      type: 'middlewareResourceItemModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'middlewareResourceItemModel/pageList',
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

  expandedRowRender = record => (
    <div>
      <Row>
        <Col lg={8} xxl={6}>
          <Badge status="success" text="创建时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col lg={8} xxl={6}>
          <Badge status="success" text="更新时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col lg={8} xxl={6}>
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
      title: '注意！！：对应的授权项也会被删除',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        console.log('OK');
        dispatch({
          type: 'middlewareResourceItemModel/delete',
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

  showUploadConfirm = () => {
    this.setState({
      uploadVisible: true,
    });
  };

  showDownloadConfirm = () => {
    this.setState({
      downLoadVisible: true,
    });
  };

  hideUploadConfirm =() =>{
    this.setState({
      uploadVisible: false,
    });
  };

  hideDownloadConfirm =() =>{
    this.setState({
      downLoadVisible: false,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareResourceItemModel/clearResourceJsonData',
    });
  };

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareResourceItemModel/setTableLoading',
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
      type: 'middlewareResourceItemModel/add',
      payload: params,
    });

    this.hideAddModal();
  };

  // 名字的核查
  nameValueCheck = (resourceName, middlewareId, resourceType, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'middlewareResourceItemModel/nameValueCheck',
      payload: {
        resourceName,
        resourceType,
        middlewareId,
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

    console.log('编辑修改');
    console.log(JSON.stringify(fields));
    console.log(JSON.stringify(item));

    let fieldsFinal = fields;
    // 针对资源的类型进行整数和展示字符转换
    if(fields.resourceType === '菜单'){
      fieldsFinal = {
        ...fieldsFinal,
        resourceType: 0
      }
    }else{
      fieldsFinal = {
        ...fieldsFinal,
        resourceType: 1
      }
    }

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fieldsFinal)) {
      this.setTableLoading();
      console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fieldsFinal),
        updateUserName: userInfo.displayName,
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'middlewareResourceItemModel/update',
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

    let  nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 24 }}>
          <Col lg={6} xxl={4}>
            <FormItem label="系统">
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
          <Col lg={6} xxl={5}>
            <FormItem label="资源名">
              {getFieldDecorator('resourceName')(
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
          <Col lg={2} xxl={7}>
            <Button icon="plus" type="primary" onClick={this.showAddModal}>
              新增
            </Button>
          </Col>
          <Col lg={3} xxl={2}>
            <ButtonGroup>
              <Tooltip placement="topRight" title="资源的批量导入" arrowPointAtCenter>
                <Button type="dash" onClick={this.showUploadConfirm}>
                  <Icon type="upload" />
                </Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="资源的批量导出" arrowPointAtCenter>
                <Button type="dash" onClick={this.showDownloadConfirm}>
                  <Icon type="download" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    );
  };

  onChange = page => {
    console.log('页面索引修改');
    this.getPageData(page);
  };

  // 获取对应中间件的所有的授权资源对应的Json数据
  getResourceJsonData=(middlewareId) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'middlewareResourceItemModel/getResourceJsonData',
      payload: middlewareId,
    });
  };

  // 导入资源对应的数据
  uploadJsonData =(middlewareId, resourceItemJsonData)=>{
    const { dispatch } = this.props;
    this.setTableLoading();
    dispatch({
      type: 'middlewareResourceItemModel/uploadJsonData',
      payload: {
        middlewareId,
        resourceItemJsonData
      },
    });

    this.hideUploadConfirm();
  };

  resourceDownload =() =>{
    const {
      downLoadVisible,
    } = this.state;
    const {
      form: { getFieldDecorator },
      middlewareSystemModel: { middlewareNameList },
      middlewareResourceItemModel: { resourceJsonData },
    } = this.props;

    let  nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }

    const onClickGetResourceJson = () => {
      const {form} = this.props;
      const middlewareId = form.getFieldValue("downloadMiddlewareId");
      this.getResourceJsonData(middlewareId);
    };

    console.log("resourceJsonData");
    console.log(JSON.stringify(resourceJsonData));

    return (
      <div>
        <Drawer
          maskClosable
          title="权限资源导出"
          width={800}
          placement="right"
          closable={false}
          onClose={this.hideDownloadConfirm}
          visible={downLoadVisible}
        >
          <Form onSubmit={this.handleSearch} layout="vertical">
            <Row gutter={{ md: 24, lg: 24, xl: 24 }}>
              <Col lg={14} xxl={10} offset={1}>
                <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="中间件系统：">
                  {getFieldDecorator('downloadMiddlewareId', {initialValue: ""})(
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
              <Col lg={2} xxl={7}>
                <Button type="primary" onClick={onClickGetResourceJson}>
                  获取数据
                </Button>
              </Col>
              <Divider />
            </Row>
            <Col offset={2} span={20}>
              <TextArea
                value={resourceJsonData}
                placeholder="请输入系统描述"
                autoSize={{ minRows: 26, maxRows: 26 }}
              />
            </Col>
          </Form>
        </Drawer>
      </div>
    );
  };

  resourceUpload =() =>{
    const {
      uploadVisible,
    } = this.state;
    const {
      form: { getFieldDecorator },
      middlewareSystemModel: { middlewareNameList },
    } = this.props;

    let  nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }

    const onClickUploadJsonData = () => {
      const {form} = this.props;
      const middlewareId = form.getFieldValue("downloadMiddlewareId");
      const resourceItemJson = form.getFieldValue("resourceItemJson");
      this.uploadJsonData(middlewareId, resourceItemJson);
    };

    return (
      <Drawer
        maskClosable
        title="权限资源导入"
        width={700}
        placement="right"
        closable={false}
        onClose={this.hideUploadConfirm}
        visible={uploadVisible}
      >
        <Row gutter={{ md: 24, lg: 24, xl: 24 }}>
          <Col lg={14} xxl={13} offset={1}>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="中间件系统：">
              {getFieldDecorator('downloadMiddlewareId')(
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
          <Col lg={6} xxl={4}>
            <Button onClick={onClickUploadJsonData} type="primary" style={{marginLeft: 80}}>
              导入
            </Button>
          </Col>
          <Divider />
        </Row>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 19}} label="资源json数据：">
          {getFieldDecorator('resourceItemJson')(
            <TextArea
              placeholder="请输入系统描述"
              autoSize={{minRows: 27, maxRows: 27}}
            />
          )}
        </FormItem>
      </Drawer>
    );
  };

  render() {
    const {
       middlewareResourceItemModel: { selectState, groupAllCodeList },
    } = this.props;
    const {
      middlewareSystemModel: { middlewareNameList },
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
      middlewareNameList,
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
       middlewareResourceItemModel: { totalNumber, pager, tableList, tableLoading },
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
        {this.resourceDownload()}
        {this.resourceUpload()}
      </PageHeaderWrapper>
    );
  }
}

export default MiddlewareResourceItemList;
