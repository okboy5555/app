import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Steps, Upload, Button, Radio, message, Input, Spin } from "antd";
import { UploadOutlined } from '@ant-design/icons';

function App() {
  const [step, setStep] = useState(0);
  const [radioValue, setRadioValue] = useState(0);

  const next = () => {
    setStep(step + 1);
    if (step === 3) {
      console.log('111')
    }
  };

  const onChange = (e) => {
    setRadioValue(e.target.value);
  };

  // 上传参数
  const props = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="App">
      {step > 0 && step < 4 && <Steps
        className="steps"
        current={step - 1}
        items={[
          {
            title: '选择审查类型',
          },
          {
            title: '选择审查图纸',
          },
          {
            title: '补充外界参数',
          },
        ]}
      />}
      {step === 0 &&
        <div>
        </div>}
      {step === 1 && <div>
        <Radio.Group onChange={onChange} value={radioValue}>
          <Radio value={0}>A</Radio>
          <Radio value={1}>B</Radio>
          <Radio value={2}>C</Radio>
          <Radio value={3}>D</Radio>
        </Radio.Group></div>}
      {step === 2 && <div>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>}
      {step === 3 && <div>
        <div>
          <div>等级</div>
          <Radio.Group onChange={onChange} value={radioValue}>
            <Radio value={0}>A</Radio>
            <Radio value={1}>B</Radio>
            <Radio value={2}>C</Radio>
            <Radio value={3}>D</Radio>
          </Radio.Group>
        </div>
        <div>
          波高
        </div>
        <Input placeholder="Basic usage" />
      </div>}
      {
        step === 4 && <div>
          <Spin />
        </div>
      }
      <div className="submit">
        {(step === 1 || step === 2 || step === 3) && <Button onClick={next}>下一步</Button>}
        {step === 0 && <Button onClick={next}>开始审图</Button>}
      </div>
    </div>
  );
}

export default App;
