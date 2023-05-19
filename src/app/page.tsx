'use client';
import { Upload, UploadFile, Form, Button } from 'antd'
import dynamic from 'next/dynamic'
import { PlusOutlined } from '@ant-design/icons'

const uploadFile = async (file: Blob, fileName: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);

  return fetch('api', {
    body: formData,
    method: 'post'
  });
};

enum FormField {
  PICTURES = 'pictures'
}

type FormValue = {
  [FormField.PICTURES]: UploadFile[],
};

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;

  return e?.fileList;
};

const handleFinish = async (value: FormValue) => {
  return Promise.all(value[FormField.PICTURES].map(picture => picture.originFileObj && uploadFile(picture.originFileObj, picture.name)))
};

const Home = () => {
  return (
    <main>
      <Form
        initialValues={{ remember: true }}
        labelAlign='left'
        onFinish={handleFinish}
      >
        <Form.Item
          key={FormField.PICTURES}
          name={FormField.PICTURES}
          valuePropName='fileList'
          getValueFromEvent={normFile}
        >
          <Upload name={FormField.PICTURES} listType='picture-card' accept='image/*'>
            <div>
              <PlusOutlined />
              <div>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>Done</Button>
        </Form.Item>
      </Form>
    </main >
  )
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false
});
