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
import styles from './BusinessCityList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
  const { modalVisible, form, handleAdd, hideAddModal } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="省份编码" hasFeedback>
        {form.getFieldDecorator('provinceCode', {
          rules: [{ required: true, message: '请输入省份编码！' }],
        })(
          <Input placeholder="请输入省份编码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="市编码" hasFeedback>
        {form.getFieldDecorator('cityCode', {
          rules: [{ required: true, message: '请输入市编码！' }],
        })(
          <Input placeholder="请输入市编码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称" hasFeedback>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！' }],
        })(
          <Input placeholder="请输入名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="中心点经纬度" hasFeedback>
        {form.getFieldDecorator('center', {
          rules: [{ required: true, message: '请输入中心点经纬度！' }],
        })(
          <Input placeholder="请输入中心点经纬度" />)}
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
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="主键id">
        {form.getFieldDecorator('id', {
          initialValue: item.id,
          rules: [{ required: true, message: '请输入主键id！' }],
        })(
          <Input placeholder="请输入主键id" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="省份编码">
        {form.getFieldDecorator('provinceCode', {
          initialValue: item.provinceCode,
          rules: [{ required: true, message: '请输入省份编码！' }],
        })(
          <Input placeholder="请输入省份编码"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="市编码">
        {form.getFieldDecorator('cityCode', {
          initialValue: item.cityCode,
          rules: [{ required: true, message: '请输入市编码！' }],
        })(
          <Input placeholder="请输入市编码"  />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '请输入名称！' }],
        })(
          <Input placeholder="请输入名称" disabled />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="创建时间">
        {form.getFieldDecorator('createTime', {
          initialValue: moment(item.createTime),
          rules: [{ required: true, message: '请输入创建时间！' }],
        })(
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="更新时间">
        {form.getFieldDecorator('updateTime', {
          initialValue: moment(item.updateTime),
          rules: [{ required: true, message: '请输入更新时间！' }],
        })(
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="中心点经纬度">
        {form.getFieldDecorator('center', {
          initialValue: item.center,
          rules: [{ required: true, message: '请输入中心点经纬度！' }],
        })(
          <Input placeholder="请输入中心点经纬度"  />
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
@connect(({ businessCityModel, loading, authCheckModel }) => ({
  businessCityModel,
  authCheckModel,
  loading: loading.models.businessCityModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class BusinessCityList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'provinceCode',
      title: '省份编码',
      dataIndex: 'provinceCode',
      width: '20%',
    },
    {
      name: 'cityCode',
      title: '市编码',
      dataIndex: 'cityCode',
      width: '20%',
    },
    {
      name: 'name',
      title: '名称',
      dataIndex: 'name',
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
      name: 'edit',
      title: '编辑',
      dataIndex: 'edit',
      width: '10%',
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
    localStorage.setItem('appName', "robot");
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
        businessCityModel: { searchParam, pager },
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
      type: 'businessCityModel/pageCount',
      payload: {
        searchParam: param,
      },
    });

    dispatch({
      type: 'businessCityModel/pageList',
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
          <Badge status="success" text="主键id：" />
          <span>{record.id}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="更新时间：" />
          {/* eslint-disable-next-line radix */}
          <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="中心点经纬度：" />
          <span>{record.center}</span>
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
          type: 'businessCityModel/delete',
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
      type: 'businessCityModel/setTableLoading',
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
      type: 'businessCityModel/add',
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
        type: 'businessCityModel/update',
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
      for(let key in fieldsValue) {
        if(fieldsValue[key] === '') {
          delete fieldsValue[key]
        }
      };
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
            <FormItem label="省份编码">
              {getFieldDecorator('provinceCode')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="市编码">
              {getFieldDecorator('cityCode')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
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
       businessCityModel: { selectState, groupAllCodeList },
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
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };

    const {
       businessCityModel: { totalNumber, pager, tableList, tableLoading },
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

export default BusinessCityList;
