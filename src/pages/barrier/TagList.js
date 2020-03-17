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
  Tag,
  Icon,
  Tooltip,
  Radio,
} from 'antd';

import moment from 'moment';
import styles from './TagList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";
import {renderSelectOptions} from "@/utils/utils";

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
  const { modalVisible, form, handleAdd, hideAddModal, types, demotions, computeTypes, transmits } = prop;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const { TextArea } = Input;

  const transimitItem = () => {
    if (form.getFieldValue('type') === 0 || form.getFieldValue('type') === 2) {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="透传">
          {form.getFieldDecorator('isTransmit', {
            initialValue: 0,
            rules: [{ required: true}],
          })(
            <Radio.Group options={transmits} disabled/>
          )}
        </FormItem>
      );
    } else {
      return (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="透传">
          {form.getFieldDecorator('isTransmit', {
            initialValue: 0,
            rules: [{ required: true}],
          })(
            <Radio.Group options={transmits}/>
          )}
        </FormItem>
      );
    }
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称" hasFeedback>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, pattern: '[(a-z0-9)\-]{4,20}$', message: '不符合规范！' }],
        })(
          <Input placeholder="请输入小写字母或中划线，4-20个字符" autoComplete="off"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="类型" hasFeedback>
        {form.getFieldDecorator('type', {
          initialValue: "",
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Select style={{width: '100%'}}>
            <Select.Option value="">---请选择----</Select.Option>
            {renderSelectOptions(types)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="降级">
        {form.getFieldDecorator('canDemotion', {
          initialValue: 0,
          rules: [{ required: true}],
        })(
          <Radio.Group options={demotions}/>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="计算类型" hasFeedback>
        {form.getFieldDecorator('computeType', {
          initialValue: "",
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Select style={{width: '100%'}}>
            <Select.Option value="">---请选择----</Select.Option>
            {renderSelectOptions(computeTypes)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="执行顺序" hasFeedback>
        {form.getFieldDecorator('filterOrder', {
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Input type="number" placeholder="值越小，执行级别越高" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述" hasFeedback>
        {form.getFieldDecorator('description', {
          rules: [{ required: true, max: 20, message: '不符合规范！' }],
        })(
          <TextArea row={4} placeholder="简短描述，20个字符" />)}
      </FormItem>

    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, hideEditModal, item, types, demotions, computeTypes, transmits } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const { TextArea } = Input;

  return (
    <Modal
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={okHandle}
      maskClosable={false}
      onCancel={() => hideEditModal()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称" hasFeedback>
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, pattern: '[(a-z0-9)\-]{4,20}$', message: '不符合规范！' }],
        })(
          <Input placeholder="请输入小写字母或中划线，4-20个字符" disabled/>)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="类型" hasFeedback>
        {form.getFieldDecorator('type', {
          initialValue: item.type,
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Select style={{width: '100%'}} disabled>
            <Select.Option value="">---请选择----</Select.Option>
            {renderSelectOptions(types)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="降级">
        {form.getFieldDecorator('canDemotion', {
          initialValue: item.canDemotion,
          rules: [{ required: true}],
        })(
          <Radio.Group options={demotions}/>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="计算类型" hasFeedback>
        {form.getFieldDecorator('computeType', {
          initialValue: item.computeType,
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Select style={{width: '100%'}}>
            <Select.Option value="">---请选择----</Select.Option>
            {renderSelectOptions(computeTypes)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="执行顺序" hasFeedback>
        {form.getFieldDecorator('filterOrder', {
          initialValue: item.filterOrder,
          rules: [{ required: true, message: '不符合规范！' }],
        })(
          <Input type="number" placeholder="值越小，执行级别越高" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述" hasFeedback>
        {form.getFieldDecorator('description', {
          initialValue: item.description,
          rules: [{ required: true, max: 20, message: '不符合规范！' }],
        })(
          <TextArea row={4} placeholder="简短描述，20个字符" />)}
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
@connect(({ tagModel, loading, authCheckModel }) => ({
  tagModel,
  authCheckModel,
  loading: loading.models.tagModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class TagList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {}
  };

  columns = [
    {
      name: 'name',
      title: '名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      name: 'type',
      title: '类型',
      dataIndex: 'type',
      width: '8%',
      render: text => {
        const {
          tagModel: {types},
        } = this.props;
        return (<Tag color={types[text].color}>{types[text].label}</Tag>)
      }
    },
    {
      name: 'canDemotion',
      title: '降级',
      dataIndex: 'canDemotion',
      width: '8%',
      render: text => {
        const {
          tagModel: {demotions},
        } = this.props;
        return (<Tag color={demotions[text].color}>{demotions[text].label}</Tag>)
      }
    },
    {
      name: 'computeType',
      title: '计算类型',
      dataIndex: 'computeType',
      width: '8%',
      render: text => {
        const {
          tagModel: {computeTypes},
        } = this.props;
        return (<Tag color={computeTypes[text].color}>{computeTypes[text].label}</Tag>)
      }
    },
    {
      name: 'isTransmit',
      title: '透传',
      dataIndex: 'isTransmit',
      width: '8%',
      render: text => {
        const {
          tagModel: {transmits},
        } = this.props;
        return (<Tag color={transmits[text].color}>{transmits[text].label}</Tag>)
      }
    },
    {
      name: 'description',
      title: '描述',
      dataIndex: 'description',
      width: '15%',
    },
    {
      name: 'filterOrder',
      title: '执行顺序',
      dataIndex: 'filterOrder',
      width: '8%',
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
      dataIndex: 'delete',
      editable: false,
      width: '10%',
      render: (text, row) => (
        <span>
          <Button type="primary" icon="edit" onClick={() => this.showEditModal(row)} />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip placement="topRight" title="删除">
            <Button type="danger" icon="delete" onClick={() => this.showDeleteConfirm(row)} />
          </Tooltip>

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
  }

  getPageData(pageNo, searchParamInput) {
    const { dispatch } = this.props;
    const {
        tagModel: { searchParam, pager },
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
      type: 'tagModel/pageList',
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
          type: 'tagModel/delete',
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
      type: 'tagModel/setTableLoading',
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

    console.log(params)
    dispatch({
      type: 'tagModel/add',
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
        type: 'tagModel/update',
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
      tagModel: {types}
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" autoComplete="off"/>
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="类型">
              {getFieldDecorator('type', {
                initialValue: "",
              })(
                <Select>
                  <Select.Option value="">---请选择----</Select.Option>
                  {renderSelectOptions(types)}
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
    console.log('页面索引修改' + page);

    this.getPageData(page);
  };

  render() {
    const {
       tagModel: { selectState, groupAllCodeList, types, demotions, computeTypes, transmits },
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
      types,
      demotions,
      computeTypes,
      transmits,
    };
    const parentEditMethods = {
      item,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
      types,
      demotions,
      computeTypes,
      transmits,
    };

    const {
       tagModel: { totalNumber, pager, tableList, tableLoading },
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
      </PageHeaderWrapper>
    );
  }
}

export default TagList;
