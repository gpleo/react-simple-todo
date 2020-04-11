import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import STATUS from './status';
import Edit from './Edit';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [{
        id: 1,
        title: 'React简单示例演示任务',
        status: 'processing',
      }, {
        id: 2,
        title: '博客更新',
        status: 'pending',
      }]
    };

    this.maxId = 2;
  }

  columns = [{
    title: '标题',
    dataIndex: 'title',
  }, {
    title: '状态',
    dataIndex: 'status',
    render: key => STATUS.find(v => v.key === key).title,
  }, {
    title: '操作',
    render: (text, record) => (
      <div style={{ display: 'flex' }}>
        <Edit record={record} onOk={this.editHandler.bind(this, record.id)}>
          <Button type="link">编辑</Button>
        </Edit>
        <Popconfirm title="确认删除？" onConfirm={this.deleteHandler.bind(this, record.id)}>
          <Button type="link" danger>删除</Button>
        </Popconfirm>
      </div>
    ),
  }];

  createHandler = (values) => {
    this.setState({
      list: [...this.state.list, {...values, id: ++this.maxId}],
    });
  };

  editHandler = (id, values) => {
    console.log(id, values);
    this.setState({
      list: this.state.list.map(v => v.id === id ? {...values, id} : v),
    });
  };

  deleteHandler = id => {
    this.setState({
      list: this.state.list.filter(v => v.id !== id),
    })
  };

  render() {
    return (
      <div>
        <div>
          <Edit record={{}} onOk={this.createHandler}>
            <Button type="primary">创建</Button>
          </Edit>
        </div>

        <Table dataSource={this.state.list} columns={this.columns} rowKey="id" />
      </div>
    );
  }
};

export default List;
