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
import Link from 'umi/link';
import moment from 'moment';
import styles from './XcheckList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getUserInfo} from "@/utils/userInfo";
import { haveAuthority } from '@/utils/authority';

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
  const { modalVisible, form, handleAdd, hideAddModal, xcheckBillDict, xcheckGroupDict, xcheckDuplexDict, xcheckStatusDict, balanceActionDict, diffHandleWayDict } = prop;
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="组" hasFeedback>
        {form.getFieldDecorator('group', {
          rules: [{ required: true, message: '请选择组！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="组"
            optionFilterProp="children"
          >
            {xcheckGroupDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称" hasFeedback>
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！' }],
        })(
          <Input placeholder="请输入名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述" hasFeedback>
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入描述！' }],
        })(
          <Input placeholder="请输入描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="左侧账单" hasFeedback>
        {form.getFieldDecorator('leftBillId', {
          rules: [{ required: true, message: '请输入左侧账单！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="左侧账单"
            optionFilterProp="children"
          >
            {xcheckBillDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="右侧账单" hasFeedback>
        {form.getFieldDecorator('rightBillId', {
          rules: [{ required: true, message: '请输入右侧账单！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="右侧账单"
            optionFilterProp="children"
          >
            {xcheckBillDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="关联条件" hasFeedback>
        {form.getFieldDecorator('billRelationCondition', {
          rules: [{ required: true, message: '请输入关联条件！' }],
        })(
          <Input placeholder="请输入关联条件" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="cron表达式" hasFeedback>
        {form.getFieldDecorator('cronExpression', {
          rules: [{ required: true, message: '请输入cron表达式！' }],
        })(
          <Input placeholder="请输入cron表达式" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="groovy脚本" hasFeedback>
        {form.getFieldDecorator('groovyScript', {
          rules: [{ required: false, message: '请输入groovy脚本！' }],
        })(
          <Input placeholder="请输入groovy脚本" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="对账方式" hasFeedback>
        {form.getFieldDecorator('duplex', {
          rules: [{ required: true, message: '请选择对账方式！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="对账方式"
            optionFilterProp="children"
          >
            {xcheckDuplexDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="平账动作" hasFeedback>
        {form.getFieldDecorator('balanceAction', {
          rules: [{ required: true, message: '请选择平账动作！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="平账动作"
            optionFilterProp="children"
          >
            {balanceActionDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="差异处理方式" hasFeedback>
        {form.getFieldDecorator('diffHandleWay', {
          rules: [{ required: true, message: '请选择差异处理方式！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="差异处理方式"
            optionFilterProp="children"
          >
            {diffHandleWayDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="并发度" hasFeedback>
        {form.getFieldDecorator('threads', {
          rules: [{ required: true, message: '请输入并发度！' }],
        })(
          <Input placeholder="请输入并发度" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="优先级" hasFeedback>
        {form.getFieldDecorator('priority', {
          rules: [{ required: true, message: '请输入优先级！' }],
        })(
          <Input placeholder="请输入优先级" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="状态" hasFeedback>
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: '请选择状态！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="状态"
            optionFilterProp="children"
          >
            {xcheckStatusDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, hideEditModal, item, xcheckBillDict, xcheckGroupDict, xcheckDuplexDict, xcheckStatusDict, balanceActionDict, diffHandleWayDict } = props;
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="组">
        {form.getFieldDecorator('group', {
          initialValue: item.group,
          rules: [{ required: true, message: '请选择组！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="组"
            optionFilterProp="children"
          >
            {xcheckGroupDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '请输入名称！' }],
        })(
          <Input placeholder="请输入名称" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述">
        {form.getFieldDecorator('desc', {
          initialValue: item.desc,
          rules: [{ required: true, message: '请输入描述！' }],
        })(
          <Input placeholder="请输入描述" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="左侧账单">
        {form.getFieldDecorator('leftBillId', {
          initialValue: item.leftBillId !== undefined ? item.leftBillId.toString() : '',
          rules: [{ required: true, message: '请输入左侧账单！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="左侧账单"
            optionFilterProp="children"
          >
            {xcheckBillDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="右侧账单">
        {form.getFieldDecorator('rightBillId', {
          initialValue: item.rightBillId !== undefined ? item.rightBillId.toString() : '',
          rules: [{ required: true, message: '请输入右侧账单！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="右侧账单"
            optionFilterProp="children"
          >
            {xcheckBillDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="关联条件">
        {form.getFieldDecorator('billRelationCondition', {
          initialValue: item.billRelationCondition,
          rules: [{ required: true, message: '请输入关联条件！' }],
        })(
          <Input placeholder="请输入关联条件" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="cron表达式">
        {form.getFieldDecorator('cronExpression', {
          initialValue: item.cronExpression,
          rules: [{ required: true, message: '请输入cron表达式！' }],
        })(
          <Input placeholder="请输入cron表达式" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="groovy脚本">
        {form.getFieldDecorator('groovyScript', {
          initialValue: item.groovyScript,
          rules: [{ required: true, message: '请输入groovy脚本！' }],
        })(
          <Input placeholder="请输入groovy脚本" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="对账方式">
        {form.getFieldDecorator('duplex', {
          initialValue: item.duplex !== undefined ? item.duplex.toString() : '',
          rules: [{ required: true, message: '请选择对账方式！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="对账方式"
            optionFilterProp="children"
          >
            {xcheckDuplexDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="平账动作">
        {form.getFieldDecorator('balanceAction', {
          initialValue: item.balanceAction !== undefined ? item.balanceAction.toString() : '',
          rules: [{ required: true, message: '请选择平账动作！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="平账动作"
            optionFilterProp="children"
          >
            {balanceActionDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="差异处理方式">
        {form.getFieldDecorator('diffHandleWay', {
          initialValue: item.diffHandleWay !== undefined ? item.diffHandleWay.toString() : '',
          rules: [{ required: true, message: '请选择差异处理方式！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="差异处理方式"
            optionFilterProp="children"
          >
            {diffHandleWayDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="并发度">
        {form.getFieldDecorator('threads', {
          initialValue: item.threads,
          rules: [{ required: true, message: '请输入并发度！' }],
        })(
          <Input placeholder="请输入并发度" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="优先级">
        {form.getFieldDecorator('priority', {
          initialValue: item.priority,
          rules: [{ required: true, message: '请输入优先级！' }],
        })(
          <Input placeholder="请输入优先级" />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="状态">
        {form.getFieldDecorator('status', {
          initialValue: item.status !== undefined ? item.status.toString() : '',
          rules: [{ required: true, message: '请选择状态！' }],
        })(
          <Select
            allowClear
            showSearch
            style={{width: '50%'}}
            placeholder="状态"
            optionFilterProp="children"
          >
            {xcheckStatusDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
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
@connect(({ authCheckModel, xcheckModel, xcheckBillModel, xcheckCommonModel, loading }) => ({
  authCheckModel,
  xcheckModel,
  xcheckBillModel,
  xcheckCommonModel,
  loading: loading.models.xcheckModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class XcheckList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'group',
      title: '组',
      dataIndex: 'group',
      width: '5%',
    },
    {
      name: 'name',
      title: '名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      name: 'desc',
      title: '描述',
      dataIndex: 'desc',
      width: '10%',
    },
    {
      name: 'leftBillName',
      title: '左侧账单',
      dataIndex: 'leftBillName',
      width: '10%',
    },
    {
      name: 'rightBillName',
      title: '右侧账单',
      dataIndex: 'rightBillName',
      width: '10%',
    },
    {
      name: 'duplexDesc',
      title: '对账方式',
      dataIndex: 'duplexDesc',
      width: '5%',
    },
    {
      name: 'balanceActionDesc',
      title: '平账动作',
      dataIndex: 'balanceActionDesc',
      width: '5%',
    },
    {
      name: 'diffHandleWayDesc',
      title: '差异处理',
      dataIndex: 'diffHandleWayDesc',
      width: '5%',
    },
    {
      name: 'threads',
      title: '并发度',
      dataIndex: 'threads',
      width: '5%',
    },
    {
      name: 'priority',
      title: '优先级',
      dataIndex: 'priority',
      width: '5%',
    },
    {
      name: 'statusDesc',
      title: '状态',
      dataIndex: 'statusDesc',
      width: '5%',
    },
    {
      name: 'taskList',
      title: '任务列表',
      dataIndex: 'taskList',
      width: '5%',
      render: (text, record) => {
        return(<Link to={{pathname:'/xcheck/xcheckTaskList',xcheckId:record.id}}>查看</Link>)
      },
    },
    {
      name: 'diffList',
      title: '差异列表',
      dataIndex: 'diffList',
      width: '5%',
      render: (text, record) => {
        return(<Link to={{pathname:'/xcheck/xcheckDiffList',xcheckId:record.id}}>查看</Link>)
      },
    },
    {
      name: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: '10%',
      render: (text, record) => {
        if (haveAuthority("xcheck_edit"))
        {
          if (record.status !== undefined && record.status === 1)
          {
            return (
              <span>
                <Button type="danger" title="禁用" icon="pause" onClick={() => this.showDisableModal(record.id)} />&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" title="修复" icon="redo" onClick={() => this.showRepairModal(record.id)} />&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="danger" title="终止" icon="close" onClick={() => this.showInterruptModal(record.id)} />
              </span>
            );
          }
          return (
            <span>
              <Button type="primary" title="启用" icon="caret-right" onClick={() => this.showEnableModal(record.id)} />&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" title="修复" icon="redo" onClick={() => this.showRepairModal(record.id)} />&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="danger" title="终止" icon="close" onClick={() => this.showInterruptModal(record.id)} />
            </span>
          );
        }
        return "";
      },
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

    const {
      xcheckModel: { activePaneName },
    } = this.props;
    // console.log('启动');

    // 获取页面的总个数
    this.getPageDate(activePaneName, 1);

    this.getDictList();
    this.getXcheckBillDictList();
  }

  // 获取字典
  getDictList(){
    const { dispatch } = this.props;
    dispatch({
      type: 'xcheckCommonModel/dictionaryQuery',
      payload: {}
    });
  }

  // 获取字典
  getXcheckBillDictList(){
    const { dispatch } = this.props;
    dispatch({
      type: 'xcheckBillModel/dictList',
      payload: {}
    });
  }

  getPageDate(name, pageNo, searchParam) {
    const { dispatch } = this.props;
    const {
        xcheckModel: { panes },
    } = this.props;

    this.setTableLoading();

    const index = panes.findIndex(pane => pane.name === name);
    if (index > -1) {
      // console.log(index);
      // console.log(JSON.stringify(searchParam));

      let param = panes[index].content.searchParam;

      // console.log(JSON.stringify(param));

      if (searchParam !== undefined) {
        // console.log('ddd');
        param = searchParam;
      }

      let pager = { ...panes[index].content.pager };
      if (pageNo !== undefined) {
        // console.log('ccc');
        pager = {
          ...pager,
          pageNo,
        };
      }

      // 获取页面的总个数
      dispatch({
        type: 'xcheckModel/pageCount',
        payload: {
          paneIndex: index,
          searchParam: param,
        },
      });

      dispatch({
        type: 'xcheckModel/pageList',
        payload: {
          paneIndex: index,
          pager,
          searchParam: param,
        },
      });
    }
  }

  expandedRowRender = record => (
    <div>
      <Row>
        <Col span={6}>
          <Badge status="success" text="关联条件：" />
          <span>{record.billRelationCondition}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="cron表达式：" />
          <span>{record.cronExpression}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="groovy脚本：" />
          <span>{record.groovyScript}</span>
        </Col>
      </Row>
      <br />

      <Row>
        <Col span={6}>
          <Badge status="success" text="创建时间：" />
          <span>{record.createTime}</span>
        </Col>
        <Col span={6}>
          <Badge status="success" text="更新时间：" />
          <span>{record.updateTime}</span>
        </Col>
      </Row>
      <br />
    </div>
  );

  showDeleteConfirm = row => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要删除这条对账单吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        // console.log('OK');
        dispatch({
          type: 'xcheckModel/delete',
          payload: {
            id:row.id,
            paneIndex,
          },
        });
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  };

  showEnableModal = id => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要启用该对账单吗？',
      okText: '确定',
      // okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        // console.log('OK');
        dispatch({
          type: 'xcheckModel/enable',
          payload: {
            id:id,
            paneIndex,
          },
        });
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  };

  showDisableModal = id => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要禁用该对账单吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        // console.log('OK');
        dispatch({
          type: 'xcheckModel/disable',
          payload: {
            id:id,
            paneIndex,
          },
        });
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  };

  showRepairModal = id => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要修复该对账单任务吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        // console.log('OK');
        dispatch({
          type: 'xcheckModel/repair',
          payload: {
            id:id,
            paneIndex,
          },
        });
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  };

  showInterruptModal = id => {
    const { dispatch } = this.props;
    // console.log('点击');
    // console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
    const showLoading = ()=>this.setTableLoading();
    Modal.confirm({
      title: '确定要终止该对账单吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        showLoading();
        // console.log('OK');
        dispatch({
          type: 'xcheckModel/interrupt',
          payload: {
            id:id,
            paneIndex,
          },
        });
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
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
      type: 'xcheckModel/setTableLoading',
    });
  };

  // 获取激活的pane
  getActivePaneIndex = () => {
    const {
      xcheckModel: { activePaneName, panes },
    } = this.props;

    return panes.findIndex(pane => pane.name === activePaneName);
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
      paneIndex: this.getActivePaneIndex(),
    };

    dispatch({
      type: 'xcheckModel/add',
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

    // console.log('编辑修改');
    // console.log(JSON.stringify(fields));
    // console.log(JSON.stringify(item));

    // 判断是否有修改，如果没有修改，则不向后端发起更新
    if (!this.contain(item, fields)) {
      this.setTableLoading();
      // console.log('有变化需要修改');
      const params = {
        ...Object.assign(item, fields),
        updateUserName: userInfo.displayName,
        paneIndex: this.getActivePaneIndex(),
      };

      // console.log(JSON.stringify(params));
      dispatch({
        type: 'xcheckModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const {
       xcheckModel: { activePaneName },
    } = this.props;

    // console.log('启动查询');
    this.setTableLoading();

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.getPageDate(activePaneName, 1, fieldsValue);
    });
  };

  // 加载搜索输入框和搜索按钮
  renderSearchForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      xcheckCommonModel: { xcheckGroupDict },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="组">
              {getFieldDecorator('group')(
                <Select
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  placeholder="请选择组"
                  optionFilterProp="children"
                >
                  {xcheckGroupDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
                </Select>
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
    const {
       xcheckModel: { activePaneName },
    } = this.props;

    console.log('页面索引修改');

    this.getPageDate(activePaneName, page);
  };

  onEdit = (targetKey, action) => {
    const { dispatch } = this.props;
    const {
       xcheckModel: { panes, maxTabIndex, activePaneName, tabIndexList },
    } = this.props;

    if (action === 'remove') {
      // 删除的不是当前激活的，则直接删除
      const activePaneNameStr = `${activePaneName}`;
      if (activePaneNameStr !== targetKey) {
        dispatch({
          type: 'xcheckModel/deletePane',
          payload: {
            panes: panes.filter(pane => pane.name !== targetKey),
            tabIndexList: tabIndexList.filter(tableIndex => tableIndex !== targetKey),
          },
        });
      } else {
        // 删除的是激活的则激活左侧标签，如果左侧没有，则激活右侧，如果右侧也没有，则删除不生效
        let newActivePaneName = '0';
        tabIndexList.forEach((tableIndex, i) => {
          if (tableIndex === targetKey) {
            if (i - 1 >= 0) {
              newActivePaneName = tabIndexList[i - 1];
            } else if (i + 1 < tabIndexList.length) {
              newActivePaneName = tabIndexList[i + 1];
            } else {
              console.log('删除不生效');
            }
            console.log(`新的激活的${newActivePaneName}`);
          }
        });

        if (newActivePaneName !== '0') {
          dispatch({
            type: 'xcheckModel/deletePaneActive',
            payload: {
              panes: panes.filter(pane => pane.name !== targetKey),
              tabIndexList: tabIndexList.filter(tableIndex => tableIndex !== targetKey),
              activePaneName: newActivePaneName,
            },
          });
        }
      }
    } else {
      const tableIndex = maxTabIndex + 1;
      const name = `${tableIndex}`;
      tabIndexList.push(name);
      panes.push({
        name,
        title: `${tableIndex}`,
        content: {
          tableList: [],
          tableLoading: false,
          searchParam: {},
          totalNumber: 0,
          pager: {
            pageNo: 1,
            pageSize: 20,
          },
        },
      });

      dispatch({
        type: 'xcheckModel/addPane',
        payload: {
          maxTabIndex: tableIndex,
          tabIndexList,
          panes,
          activePaneName: name,
        },
      });

      this.getPageDate(name, 1);
    }
  };

  onTabChange = activePaneName => {
    const { dispatch } = this.props;

    dispatch({
      type: 'xcheckModel/activePane',
      payload: activePaneName,
    });
  };

  render() {
    const {
       xcheckModel: { selectState, groupAllCodeList },
    } = this.props;

    const {
      xcheckCommonModel: { xcheckGroupDict, xcheckDuplexDict, xcheckStatusDict, balanceActionDict, diffHandleWayDict},
    } = this.props;

    const {
      xcheckBillModel: { xcheckBillDict },
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
      xcheckGroupDict,
      xcheckDuplexDict,
      xcheckStatusDict,
      balanceActionDict,
      diffHandleWayDict,
      xcheckBillDict,
      handleAdd: this.handleAdd,
      hideAddModal: this.hideAddModal,
    };
    const parentEditMethods = {
      item,
      xcheckGroupDict,
      xcheckDuplexDict,
      xcheckStatusDict,
      balanceActionDict,
      diffHandleWayDict,
      xcheckBillDict,
      handleEdit: this.handleEdit,
      hideEditModal: this.hideEditModal,
    };

    const {
       xcheckModel: { panes, activePaneName },
    } = this.props;

    const tabPanes = panes.map(pane => (
      <Tabs.TabPane tab={pane.title} key={pane.name}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <Table
              size="middle"
              rowKey={record => record.id}
              components={components}
              dataSource={pane.content.tableList}
              columns={this.columns}
              loading={pane.content.tableLoading}
              pagination={false}
              expandedRowRender={this.expandedRowRender}
            />
            <br />
            <Pagination
              showQuickJumper
              onChange={this.onChange}
              defaultCurrent={1}
              total={pane.content.totalNumber}
              current={pane.content.pager.pageNo}
              defaultPageSize={pane.content.pager.pageSize}
            />
          </div>
        </Card>
      </Tabs.TabPane>
    ));

    return (
      <PageHeaderWrapper>
        <Tabs
          onChange={this.onTabChange}
          activeKey={activePaneName}
          defaultActiveKey="1"
          type="editable-card"
          onEdit={this.onEdit}
        >
          {tabPanes}
        </Tabs>
        <CreateForm {...parentAddMethods} modalVisible={addModalVisible} />
        <EditForm {...parentEditMethods} modalVisible={editModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default XcheckList;
