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