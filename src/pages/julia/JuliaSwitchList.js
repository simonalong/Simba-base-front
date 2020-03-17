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
  Switch,
  Select,
  Pagination,
  InputNumber,
  Transfer,
  Drawer,
  Progress,
  Modal,
  List,
  Divider,
} from 'antd';

import moment from 'moment';
import styles from './JuliaSwitchList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";
import { haveAuthority } from '@/utils/authority';

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
  const { modalVisible, form, handleAdd, hideAddModal, getGroupList, nameValueCheck } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const nameExistValid = (rule, value, callback) => {
    nameValueCheck(value, form.getFieldValue("switchGroupId"), callback)
  };

  let groupOptions;
  if(getGroupList){
    groupOptions = getGroupList.map(d => <Select.Option key={d.id}>{d.groupName}</Select.Option>);
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关组" hasFeedback>
        {form.getFieldDecorator('switchGroupId', {
          rules: [{ required: true, message: '请输入开关组！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '100%'}}
            placeholder="请选择开关组"
            optionFilterProp="children"
          >
            {groupOptions}
          </Select>
          )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关key" hasFeedback>
        {form.getFieldDecorator('switchName', {
          rules: [{ required: true, message: '请输入开关key！' },{
            validator: nameExistValid
          }],
        })(
          <Input placeholder="请输入开关key" />
          )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="值">
        {form.getFieldDecorator('switchValue')(
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={false} />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关描述" hasFeedback>
        {form.getFieldDecorator('switchDesc', {
          rules: [{ required: true, message: '请输入开关描述！' }],
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

  const editValue = () =>{
    if(haveAuthority("chg_switch_value")) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="值">
          {form.getFieldDecorator('switchValue', {
            initialValue: item.switchValue
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={item.switchValue} />
          )}
        </FormItem>
      );
    }
    return (
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="值">
        {form.getFieldDecorator('switchValue', {
          initialValue: item.switchValue
        })(
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={item.switchValue} disabled />
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务">
        {form.getFieldDecorator('switchGroupName', {
          initialValue: item.switchGroupName,
          rules: [{ required: true, message: '请输入业务id！' }],
        })(
          <Input placeholder="请输入业务id" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关key">
        {form.getFieldDecorator('switchName', {
          initialValue: item.switchName,
          rules: [{ required: true, message: '请输入开关key！' }],
        })(
          <Input placeholder="请输入开关key" disabled />
        )}
      </FormItem>
      {editValue()}
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开关描述">
        {form.getFieldDecorator('switchDesc', {
          initialValue: item.switchDesc,
          rules: [{ required: true, message: '请输入开关描述！' }],
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
@connect(({ juliaSwitchModel, businessModel, juliaSwitchGroupModel, loading, authCheckModel }) => ({
  juliaSwitchModel,
  businessModel,
  juliaSwitchGroupModel,
  authCheckModel,
  loading: loading.models.juliaSwitchModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class JuliaSwitchList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    // 灰度的draw可见性
    grayDrawVisible: false,
    // 选择的灰度id
    selectedKeys: [],
    item: {},
  };

  columns = [
    {
      name: 'switchGroupName',
      title: '业务',
      dataIndex: 'switchGroupName',
      width: '20%',
    },
    {
      name: 'switchName',
      title: '开关key',
      dataIndex: 'switchName',
      width: '10%',
    },
    {
      name: 'switchDesc',
      title: '开关描述',
      dataIndex: 'switchDesc',
      width: '40%',
    },
    {
      name: 'switchValue',
      title: '值',
      dataIndex: 'switchValue',
      width: '5%',
      render: (text, record) => {
        const {
          juliaSwitchModel: {switchLoadingList},
        } = this.props;

        let disableFlag = false;
        if (record.grayRatio !== 0) {
          disableFlag = true;
        }

        let checked = false;
        if(text === 1){
          checked = true;
        }

        // 获取开关的状态
        let loading = false;
        for (let index = 0; index < switchLoadingList.length; index += 1) {
          if (record.id === switchLoadingList[index].id) {
            if(switchLoadingList[index].loading){
              loading = true;
            }
          }
        }

        if(haveAuthority("chg_switch_value")){
          return (<Switch checkedChildren="开" unCheckedChildren="关" checked={checked} loading={loading} onChange={() => this.handleSwitchChange(record, text)} disabled={disableFlag} />);
        }
        return (<Switch checkedChildren="开" unCheckedChildren="关" checked={checked} loading={loading} onChange={() => this.handleSwitchChange(record, text)} disabled />);
      }
    },
    {
      name: 'grayRatio',
      title: '灰度占比',
      dataIndex: 'grayRatio',
      width: '10%',
      render: (text) => {
        if(text == null || text === 0){
          return (<span />);
        }
        return (<Progress type="line" percent={text} width={40} strokeWidth={10} />);
      }
    },
    {
      name: 'gray',
      title: '创建灰度',
      dataIndex: 'gray',
      width: '10%',
      render: (text, record) => {
        if(haveAuthority("add_gray")) {
          return (
            <span>
              <Button type="primary" onClick={() => this.showGrayDraw(record)}>创建灰度</Button>
            </span>
          );
        }
        return (
          <span>
            <Button type="primary" onClick={() => this.showGrayDraw(record)} disabled>创建灰度</Button>
          </span>
        );
      }
    },
    {
      name: 'edit',
      title: '编辑',
      dataIndex: 'edit',
      width: '5%',
      render: (text, record) => {
        if (record.grayRatio == null || record.grayRatio === 0) {
          if(haveAuthority("edit_switch")) {
            return (<Button type="primary" icon="edit" onClick={() => this.showEditModal(record)} />);
          }
        }
        return (<Button type="primary" icon="edit" disabled />);
      }
    },
    {
      name: 'delete',
      title: '删除',
      dataIndex: 'delete',
      editable: false,
      width: '5%',
      render: (text, record) => {
        if (record.grayRatio == null || record.grayRatio === 0) {
          if(haveAuthority("delete_switch")){
            return (<Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(record)} />);
          }
        }
        return (<Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(record)} disabled />);
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
    this.getBusinessList();
    this.getSwitchGroupList();
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        juliaSwitchModel: { searchParam, pager },
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
      type: 'juliaSwitchModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'juliaSwitchModel/pageList',
      payload: {
        pager: pagerFinal,
        searchParam: param,
      },
    });
  }

  // 获取业务的列表
  getBusinessList(){
    // console.log("send");
    const { dispatch } = this.props;
    dispatch({
      type: 'businessModel/getList',
      payload: {}
    });
  }

  // 获取业务的列表
  getSwitchGroupList(){
    // console.log("getSwitchGroupList");
    const { dispatch } = this.props;
    dispatch({
      type: 'juliaSwitchGroupModel/getGroupList',
    });
  }

  expandedRowRender = record => {
    // 不是灰度
    if (record.grayRatio == null || record.grayRatio === 0) {
      return (
        <div>
          <Row>
            <Col span={3}>
              <Badge status="success" text="创建人：" />
              <span>{record.createUserName}</span>
            </Col>
            <Col span={3}>
              <Badge status="success" text="更新人：" />
              <span>{record.updateUserName}</span>
            </Col>
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
          </Row>
          <br />
        </div>
      );
    }

    let checked = true;
    // 如果是开启，则这里灰度显示为关闭
    if(record.switchValue === 1){
      checked = false;
    }

    const cancel = () => {
      if(haveAuthority("cancel_gray")) {
        return (
          <Col span={2}>
            <Button type="danger" onClick={() => this.handleGrayRollback(record)}>取消灰度</Button>
          </Col>
        );
      }
      return (<span />);
    };

    const applyAllGray = () => {
      if(haveAuthority("publish_all_gray")) {
        return (
          <Col span={3}>
            <Button onClick={() => this.handleGrayApply(record)}>全量发布</Button>
          </Col>
        );
      }
      return (<span />);
    };

    const grayIpList =() => {
      if(haveAuthority("add_gray")) {
        return (
          <Row>
            <List
              // 一行放多少个数据
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 6,
              }}
              dataSource={record.grayIpList}
              renderItem={item => (
                <List.Item>
                  <Card style={{ width: 240 }}>
                    {item} - <Switch checkedChildren="开" unCheckedChildren="关" checked={checked} disabled />
                  </Card>
                </List.Item>
              )}
            />
          </Row>
        );
      }
      return (<span />);
    };

    // 灰度情况下的展示
    return (
      <div>
        <br />
        <Row>
          <Col span={3}>
            <Badge status="success" text="创建人：" />
            <span>{record.createUserName}</span>
          </Col>
          <Col span={3}>
            <Badge status="success" text="更新人：" />
            <span>{record.updateUserName}</span>
          </Col>
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
          {applyAllGray()}
          {cancel()}
        </Row>
        <Divider />
        {grayIpList()}
      </div>
    );
  };

  // 应用灰度
  handleGrayApply = record =>{
    const { dispatch } = this.props;

    // 设置表刷新
    this.setTableLoading();

    dispatch({
      type: 'juliaSwitchModel/applyGray',
      payload: {
        switchId: record.id
      },
    });
  };

  // 灰度灰度
  handleGrayRollback = record =>{
    const { dispatch } = this.props;
    // 设置表刷新
    this.setTableLoading();

    dispatch({
      type: 'juliaSwitchModel/rollbackGray',
      payload: {
        switchId: record.id
      }
    });
  };

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
          type: 'juliaSwitchModel/delete',
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
    let item=record;
    if(record.switchValue===1){
      item={
        ...item,
        switchValue: true,
      }
    }else{
      item={
        ...item,
        switchValue: false
      }
    }
    this.setState({
      item,
      editModalVisible: true,
    });
  };

  hideEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
  };

  // 展示灰度发布的配置框
  showGrayDraw = (record) => {
    this.setState({
      grayDrawVisible: true,
      item: record,
    });

    this.getIpList(record);
  };

  // 获取当前配置的全部ip列表和已经配置灰度的ip列表
  getIpList = (record) => {
    const {dispatch} = this.props;
    const {id} = record;
    dispatch({
      type: 'juliaSwitchModel/getAllGrayIpList',
      payload: id
    });

    dispatch({
      type: 'juliaSwitchModel/getGraySelectedIpList',
      payload: id
    });
  };

  // 隐藏灰度发布的配置框
  hideGrayDraw=()=>{
    this.setState({
      grayDrawVisible: false,
      item: {},
    });
  };

  // 设置表格加载
  setTableLoading = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'juliaSwitchModel/setTableLoading',
    });
  };

  // 名字的核查
  nameValueCheck = (value, switchGroupId, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'juliaSwitchModel/nameValueCheck',
      payload: {
        switchName: value,
        switchGroupId,
      },
      callback,
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
    let params = {
      ...fields,
      createUserName: userName,
    };

    // 开关与0和1的转换
    if (fields.switchValue === true) {
      params = {
        ...params,
        switchValue:1
      };
    }else{
      params = {
        ...params,
        switchValue:0
      };
    }

    dispatch({
      type: 'juliaSwitchModel/add',
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
      let params = {
        ...Object.assign(item, fields),
        updateUserName: userName,
      };

      // 开关与0和1的转换
      if (fields.switchValue === true) {
        params = {
          ...params,
          switchValue:1
        };
      }else{
        params = {
          ...params,
          switchValue:0
        };
      }

      console.log(JSON.stringify(params));
      dispatch({
        type: 'juliaSwitchModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  // 开关变更的时候
  handleSwitchChange=(record, text)=>{
    console.log("handleSwitchChange");
    const { dispatch } = this.props;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    let params = {
      ...record,
      updateUserName: userName,
    };
    if (text === 1) {
      params = {
        ...params,
        switchValue: 0
      };
    } else {
      params = {
        ...params,
        switchValue: 1
      };
    }

    // 设置当前的这个开关为刷新状态
    dispatch({
      type: 'juliaSwitchModel/setSwitchLoading',
      payload: {
        switchId: record.id
      },
    });

    console.log("setSwitchLoading");
    console.log(JSON.stringify(params));
    dispatch({
      type: 'juliaSwitchModel/update',
      payload: params,
    });
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

  insertButton = () =>
    // if (haveAuthority("insert")) {
    //   return (<Button icon="plus" type="primary" onClick={this.showAddModal}>新建</Button>);
    // }
    // return (<span />);
     (<Button icon="plus" type="primary" onClick={this.showAddModal}>新建</Button>)
  ;

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      juliaSwitchGroupModel: { getGroupList},
    } = this.props;


    let groupOptions;
    if(getGroupList){
      groupOptions = getGroupList.map(d => <Select.Option key={d.id}>{d.groupName}</Select.Option>);
    }

    // eslint-disable-next-line consistent-return
    const addModel = () => {
      if (haveAuthority("add_switch")) {
        return(
          <Col md={2} sm={24}>
            <Col md={2} sm={24}>
              {this.insertButton()}
            </Col>
          </Col>
        );
      }
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="开关组">
              {getFieldDecorator('switchGroupId')(
                <Select
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  placeholder="请选择开关组"
                  optionFilterProp="children"
                >
                  {groupOptions}
                </Select>
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="开关key">
              {getFieldDecorator('switchName')(
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

  drawHandleChange=(nextTargetKeys) => {
    const{dispatch} = this.props;
    dispatch({
      type: 'juliaSwitchModel/updateTargetKeys',
      payload: nextTargetKeys
    });
  };

  drawHandleSelectChange=(sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    // console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    // console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  // 提交右侧的资源项和资源的关联
  submitSelectGrayIps =()=>{
    const { dispatch } = this.props;
    const { item } = this.state;
    const {
      juliaSwitchModel: {targetList, originalTargetList},
    } = this.props;
    const userInfo = getUserInfo();
    let userName = "";
    if(userInfo !== null) {
      userName = userInfo.displayName;
    }

    this.setTableLoading();

    console.log("originalTargetList");
    console.log(JSON.stringify(originalTargetList));

    let addFlag;
    // 目标数据为空，则本次为增加，否则为递增
    if (undefined === originalTargetList || originalTargetList.length === 0) {
      addFlag = 0;
    } else {
      addFlag = 1;
    }

    dispatch({
      type: 'juliaSwitchModel/submitGraySelect',
      payload: {
        switchId: item.id,
        addOrIncrementFlag: addFlag,
        ipPortList: targetList,
        updateUserName: userName,
      }
    });

    this.hideGrayDraw();
  };

  DrawGray =() =>{
    const {
      grayDrawVisible,
      selectedKeys,
      item,
    } = this.state;
    const {
      juliaSwitchModel: {allList, targetList},
    } = this.props;

    // console.log("allList list");
    // console.log(JSON.stringify(allList));
    // console.log("targetList list");
    // console.log(JSON.stringify(targetList));
    // console.log("item list");
    // console.log(JSON.stringify(item));

    const {switchValue} = item;
    let currentValue;
    let grayValue;
    if(switchValue === 1){
      currentValue = '开启';
      grayValue = '关闭';
    }else{
      currentValue = '关闭';
      grayValue = '开启';
    }

    const allItem = [];
    for (let index = 0; index < allList.length; index += 1) {
      const resourceItem = allList[index];

      // 禁用灰度中的ip，因为灰度的机器不能减少，只能新增
      if (targetList.indexOf(resourceItem) !== -1) {
        allItem.push({
          key: resourceItem,
          title: resourceItem,
          description: resourceItem,
          disabled: true,
        });
      } else {
        allItem.push({
          key: resourceItem,
          title: resourceItem,
          description: resourceItem,
        });
      }
    }

    const submitGray =() =>{
      if(haveAuthority("submitGray")) {
        return (
          <Button onClick={this.submitSelectGrayIps} type="primary" style={{ marginLeft: 150 }}>
            灰度发布
          </Button>
        );
      }
      return (<span />);
    };

    return (
      <Drawer
        title="灰度配置"
        width={700}
        placement="right"
        closable={false}
        onClose={this.hideGrayDraw}
        visible={grayDrawVisible}
      >
        <Transfer
          dataSource={allItem}
          titles={[`未发布的 - ${currentValue}`, `发布的 - ${grayValue}`]}
          listStyle={{
            width: 300,
            height: 610,
          }}
          showSearch
          targetKeys={targetList}
          selectedKeys={selectedKeys}
          onChange={this.drawHandleChange}
          onSelectChange={this.drawHandleSelectChange}
          render={(tem) => tem.title}
          onSearch={this.drawHandleScroll}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '2px solid #e9e9e9',
            padding: '20px 16px',
            background: '#fff',
            textAlign: 'left',
          }}
        >
          <Button onClick={this.hideGrayDraw} style={{ marginLeft: 200 }}>
            取消
          </Button>
          {submitGray()}
        </div>
      </Drawer>
    );
  };

  render() {
    const {
       juliaSwitchModel: { selectState, groupAllCodeList },
    } = this.props;
    const {
      businessModel: { businessList },
    } = this.props;
    const {
      juliaSwitchGroupModel: { getGroupList},
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
      businessList,
      getGroupList,
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
       juliaSwitchModel: { totalNumber, pager, tableList, tableLoading },
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
        {this.DrawGray()}
      </PageHeaderWrapper>
    );
  }
}

export default JuliaSwitchList;
