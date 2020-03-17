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
import styles from './MiddlewareBusinessManagerList.less';
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
  const { modalVisible, form, handleAdd, hideAddModal, userAccountList, middlewareNameList, selectedAccountValue, handleAccountListChange, handleAccountListSearch } = prop;
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务人" hasFeedback>
        {form.getFieldDecorator('managerName', {
          initialValue: selectedAccountValue,
          rules: [{ required: true, message: '请输入业务人！' }],
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="业务人">
        {form.getFieldDecorator('managerName', {
          initialValue: item.managerName,
          rules: [{ required: true, message: '请输入业务人！' }],
        })(
          <Input placeholder="请输入业务人"  />
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
@connect(({ middlewareBusinessManagerModel, middlewareSystemModel, accountModel, authCheckModel, loading }) => ({
  middlewareBusinessManagerModel,
  middlewareSystemModel,
  authCheckModel,
  accountModel,
  loading: loading.models.middlewareBusinessManagerModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class MiddlewareBusinessManagerList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'middlewareName',
      title: '中间件系统',
      dataIndex: 'middlewareName',
      width: '15%',
    },
    {
      name: 'middlewareAlias',
      title: '系统别名',
      dataIndex: 'middlewareAlias',
      width: '20%',
    },
    {
      name: 'managerName',
      title: '业务人',
      dataIndex: 'managerName',
      width: '10%',
    },
    {
      name: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      render: (text, record) => (
        // eslint-disable-next-line radix
        <span>{moment(parseInt(record.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      name: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '15%',
      render: (text, record) => (
        // eslint-disable-next-line radix
        <span>{moment(parseInt(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      name: 'createUserName',
      title: '创建人',
      dataIndex: 'createUserName',
      width: '10%',
    },
    {
      name: 'updateUserName',
      title: '更新人',
      dataIndex: 'updateUserName',
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
    const {
      middlewareBusinessManagerModel: { activePaneName },
    } = this.props;
    console.log('启动');
    const { location, dispatch} = this.props;
    localStorage.setItem('currentPath', location.pathname);
    dispatch({
      type: 'authCheckModel/checkPage',
      payload: {},
    });

    // 获取页面的总个数
    this.getPageDate(activePaneName, 1);
    this.getMiddlewareNameList();
  }

  getPageDate(name, pageNo, searchParam) {
    const { dispatch } = this.props;
    const {
        middlewareBusinessManagerModel: { panes },
    } = this.props;

    this.setTableLoading();

    const index = panes.findIndex(pane => pane.name === name);
    if (index > -1) {
      console.log(index);
      console.log(JSON.stringify(searchParam));

      let param = panes[index].content.searchParam;

      console.log(JSON.stringify(param));

      if (searchParam !== undefined) {
        console.log('ddd');
        param = searchParam;
      }

      let pager = { ...panes[index].content.pager };
      if (pageNo !== undefined) {
        console.log('ccc');
        pager = {
          ...pager,
          pageNo,
        };
      }

      // 获取页面的总个数
      dispatch({
        type: 'middlewareBusinessManagerModel/pageCount',
        payload: {
          paneIndex: index,
          searchParam: param,
        },
      });

      dispatch({
        type: 'middlewareBusinessManagerModel/pageList',
        payload: {
          paneIndex: index,
          pager,
          searchParam: param,
        },
      });
    }
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
    </div>
  );

  showDeleteConfirm = row => {
    const { dispatch } = this.props;
    console.log('点击');
    console.log(JSON.stringify(row));
    const paneIndex = this.getActivePaneIndex();
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
          type: 'middlewareBusinessManagerModel/delete',
          payload: {
            id:row.id,
            paneIndex,
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
      type: 'middlewareBusinessManagerModel/setTableLoading',
    });
  };

  // 获取激活的pane
  getActivePaneIndex = () => {
    const {
      middlewareBusinessManagerModel: { activePaneName, panes },
    } = this.props;

    return panes.findIndex(pane => pane.name === activePaneName);
  };

  // 保存授予中间价系统权限的用户名字
  handleAccountListChange = name =>{
    console.log("chg");
    console.log(name);
    const { dispatch } = this.props;
    dispatch({
      type: 'accountModel/saveAccountName',
      payload: name,
    });
  };

  // 名字搜索变更时候用户名字的查询
  handleAccountListSearch = name =>{
    console.log("search");
    console.log(name);

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
      paneIndex: this.getActivePaneIndex(),
    };

    dispatch({
      type: 'middlewareBusinessManagerModel/add',
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
        paneIndex: this.getActivePaneIndex(),
      };

      console.log(JSON.stringify(params));
      dispatch({
        type: 'middlewareBusinessManagerModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const {
       middlewareBusinessManagerModel: { activePaneName },
    } = this.props;

    console.log('启动查询');
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
      middlewareSystemModel: { middlewareNameList },
    } = this.props;

    let nameOptions;
    if(middlewareNameList){
      nameOptions = middlewareNameList.map(d => <Select.Option key={d.id}>{d.middlewareName}（{d.middlewareAlias}）</Select.Option>);
    }


    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={9} xxl={7}>
            <FormItem label="中间件系统">
              {getFieldDecorator('middlewareId')(
                <Select
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  placeholder="请选择系统"
                  optionFilterProp="children"
                >
                  {nameOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} xxl={5}>
            <FormItem label="业务人">
              {getFieldDecorator('managerName')(
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
       middlewareBusinessManagerModel: { activePaneName },
    } = this.props;

    console.log('页面索引修改');

    this.getPageDate(activePaneName, page);
  };

  onEdit = (targetKey, action) => {
    const { dispatch } = this.props;
    const {
       middlewareBusinessManagerModel: { panes, maxTabIndex, activePaneName, tabIndexList },
    } = this.props;

    if (action === 'remove') {
      // 删除的不是当前激活的，则直接删除
      const activePaneNameStr = `${activePaneName}`;
      if (activePaneNameStr !== targetKey) {
        dispatch({
          type: 'middlewareBusinessManagerModel/deletePane',
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
            type: 'middlewareBusinessManagerModel/deletePaneActive',
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
        title: `业务管理者${tableIndex}`,
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
        type: 'middlewareBusinessManagerModel/addPane',
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
      type: 'middlewareBusinessManagerModel/activePane',
      payload: activePaneName,
    });
  };

  render() {
    const {
       middlewareBusinessManagerModel: { selectState, groupAllCodeList },
    } = this.props;
    const {
      middlewareSystemModel: { middlewareNameList },
    } = this.props;

    const {
      accountModel: { userAccountList, selectedAccountValue },
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

    const {
       middlewareBusinessManagerModel: { panes, activePaneName },
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

export default MiddlewareBusinessManagerList;
