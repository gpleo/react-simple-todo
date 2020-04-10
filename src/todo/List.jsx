import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: '标题',
  dataIndex: 'title',
}, {
  title: '状态',
  dataIndex: 'status',
}];

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [{
        id: 1,
        title: 'React简单示例演示任务',
        status: '进行中',
      }, {
        id: 2,
        title: '博客更新',
        status: '未开始',
      }]
    }
  }

  render() {
    return (
      <Table dataSource={this.state.list} columns={columns} rowKey="id" />
    );
  }
};

export default List;
