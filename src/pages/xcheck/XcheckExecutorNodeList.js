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
import styles from './XcheckExecutorNodeList.less';
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

/* eslint react/no-multi-comp:0 */
@connect(({ authCheckModel, xcheckExecutorNodeModel, xcheckCommonModel, loading }) => ({
  authCheckModel,
  xcheckExecutorNodeModel,
  xcheckCommonModel,
  loading: loading.models.xcheckExecutorNodeModel,
}))
// @Form.create() 是一个注解，就简化了xxx = Form.create(xxx);export xxx
@Form.create()
class XcheckExecutorNodeList extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    item: {},
  };

  columns = [
    {
      name: 'instanceId',
      title: '实例id',
      dataIndex: 'instanceId',
      width: '15%',
    },
    {
      name: 'hostname',
      title: '主机名',
      dataIndex: 'hostname',
      width: '15%',
    },
    {
      name: 'ip',
      title: 'ip',
      dataIndex: 'ip',
      width: '15%',
    },
    {
      name: 'statusDesc',
      title: '状态',
      dataIndex: 'statusDesc',
      width: '15%',
    },
    {
      name: 'heartbeatTime',
      title: '心跳时间',
      dataIndex: 'heartbeatTime',
      width: '20%',
    },

    {
      name: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
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
      xcheckExecutorNodeModel: { activePaneName },
    } = this.props;
    // console.log('启动');

    // 获取页面的总个数
    this.getPageDate(activePaneName, 1);

    this.getDictList();

  }

  getDictList(){
    const { dispatch } = this.props;
    dispatch({
      type: 'xcheckCommonModel/dictionaryQuery',
      payload: {}
    });
  }

  getPageDate(name, pageNo, searchParam) {
    const { dispatch } = this.props;
    const {
        xcheckExecutorNodeModel: { panes },
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
        type: 'xcheckExecutorNodeModel/pageCount',
        payload: {
          paneIndex: index,
          searchParam: param,
        },
      });

      dispatch({
        type: 'xcheckExecutorNodeModel/pageList',
        payload: {
          paneIndex: index,
          pager,
          searchParam: param,
        },
      });
    }
  }

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
          type: 'xcheckExecutorNodeModel/delete',
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
      type: 'xcheckExecutorNodeModel/setTableLoading',
    });
  };

  // 获取激活的pane
  getActivePaneIndex = () => {
    const {
      xcheckExecutorNodeModel: { activePaneName, panes },
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
      type: 'xcheckExecutorNodeModel/add',
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
        type: 'xcheckExecutorNodeModel/update',
        payload: params,
      });
    }

    this.hideEditModal();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const {
       xcheckExecutorNodeModel: { activePaneName },
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
      xcheckCommonModel: { nodeStatusDict },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={5}>
            <FormItem label="主机名">
              {getFieldDecorator('hostname')(
                <Input placeholder="请输入" />
               )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="ip">
              {getFieldDecorator('ip')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col lg={5}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  placeholder="请选择状态"
                  optionFilterProp="children"
                >
                  {nodeStatusDict.map(d => <Select.Option key={d.val}>{d.desc}</Select.Option>)}
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
        </Row>
      </Form>
    );
  };

  onChange = page => {
    const {
       xcheckExecutorNodeModel: { activePaneName },
    } = this.props;

    // console.log('页面索引修改');

    this.getPageDate(activePaneName, page);
  };

  onEdit = (targetKey, action) => {
    const { dispatch } = this.props;
    const {
       xcheckExecutorNodeModel: { panes, maxTabIndex, activePaneName, tabIndexList },
    } = this.props;

    if (action === 'remove') {
      // 删除的不是当前激活的，则直接删除
      const activePaneNameStr = `${activePaneName}`;
      if (activePaneNameStr !== targetKey) {
        dispatch({
          type: 'xcheckExecutorNodeModel/deletePane',
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
            type: 'xcheckExecutorNodeModel/deletePaneActive',
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
        title: `执行器节点${tableIndex}`,
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
        type: 'xcheckExecutorNodeModel/addPane',
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
      type: 'xcheckExecutorNodeModel/activePane',
      payload: activePaneName,
    });
  };

  render() {
    const {
       xcheckExecutorNodeModel: { selectState, groupAllCodeList },
    } = this.props;

    // 替换表Table的组件
    const components = {
      body: {
        row: EditableFormRow,
        // cell: EditableCell,
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
       xcheckExecutorNodeModel: { panes, activePaneName },
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
        {/*<CreateForm {...parentAddMethods} modalVisible={addModalVisible} />*/}
        {/*<EditForm {...parentEditMethods} modalVisible={editModalVisible} />*/}
      </PageHeaderWrapper>
    );
  }
}

export default XcheckExecutorNodeList;
