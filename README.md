一、环境信息
---

- NodeJS：v12.16.1
- Yarn：1.22.4
- create-react-app：3.4.1

二、创建项目
---

使用React官方脚手架创建项目：

```
create-react-app react-simple-todo
cd react-simple-todo
yarn start
```

浏览器出现以下画面，项目生成成功。

![](http://blog.gopersist.com/images/react-simple-todo/001.png)

三、Todo List

使用下面的命令添加路由依赖：

```
yarn add react-router-dom antd
```

src目录下增加todo文件夹，新在todo下新建文件List.jsx，内容如下：

```javascript
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
```

调整index.js，增加路由，最终内容如下：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Todo from './todo/List';

ReactDOM.render(
  <Router>
    <Route path="/" component={App} exact />
    <Route path="/todo" component={Todo} />
  </Router>,
  document.getElementById('root')
);
```

此时在浏览器中输入()[http://localhost:3000/todo]，可以访问todoList，但antd的没有样式，如下图：

![](http://blog.gopersist.com/images/react-simple-todo/002.png)

执行下面的命令，将配置暴露出来：

```
yarn run eject
```

安装插件：

```
yarn add babel-plugin-import --save-dev
```

在package.json的babel节点下增加plugins配置，使其像下面这样：

```
  "babel": {
    "presets": [
      "react-app"
    ],
    "plugins": [
      ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
    ]
  }
```

服务停掉重启一次，然后界面刷新后antd样式可以正常，如下：

![](http://blog.gopersist.com/images/react-simple-todo/003.png)

三、Todo Edit

接下来增加创建、修改、删除TODO的功能，首先增加Edit.jsx，用于实现编辑功能。

```javascript
import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import STATUS from './status';

const Edit = ({ children, onOk, record }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(record);
    }
  }, [visible, form, record]);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  function showHandler(e) {
    if (e) e.stopPropagation();
    setVisible(true);
  }

  function hideHandler() {
    setVisible(false);
  }

  async function okHandler () {
    try {
      const values = await form.validateFields();
      console.log('Success: ', values);
      hideHandler();
      onOk(values);
    } catch (errorInfo) {
      console.log('Failed: ', errorInfo);
    }
  }

  return (
    <span>
        <span onClick={showHandler}>
          { children }
        </span>

        <Modal
          title="编辑"
          visible={visible}
          onOk={okHandler}
          onCancel={hideHandler}
          getContainer={false}
        >
          <Form
            {...layout}
            form={form}
            initialValues={{
              status: record.status || STATUS[0].key,
            }}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="状态"
              name="status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                {
                  STATUS.map(v => (
                    <Select.Option key={v.key} value={v.key}>{v.title}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </span>
  );
};

export default Edit;
```

然后调整List.jsx，增加增删改入口：

```javascript
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
```

最终效果：

![](http://blog.gopersist.com/images/react-simple-todo/004.png)

![](http://blog.gopersist.com/images/react-simple-todo/005.png)

![](http://blog.gopersist.com/images/react-simple-todo/006.png)

示例代码下载地址：[https://github.com/gpleo/react-simple-todo](https://github.com/gpleo/react-simple-todo)