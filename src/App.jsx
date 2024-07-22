import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Steps, Upload, Button, Radio, message, Input, Spin, Image } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

function App() {
  const [step, setStep] = useState(0);
  const [radioValue, setRadioValue] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const next = () => {
    if (step === 2) {
      if (!imageUrl || imageUrl === '') {
        message.error('请上传图片');
        return
      }
    };
    if (step === 3) {
      axios.post('/your-upload-api-endpoint', {
        image: imageUrl,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          message.success('Upload successful!');
        })
        .catch(error => {
          setStep(5);
          message.error('Upload failed!');
        });
    }
    setStep(step + 1);
  };

  const onChange = (e) => {
    setRadioValue(e.target.value);
  };

  useEffect(() => {
    console.log(imageUrl, 'imageUrl')
  }, [imageUrl])

  useEffect(() => {

  }, []);

  const handleUpload = (info) => {
    // eslint-disable-next-line no-restricted-globals
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;
      setImageUrl(imageUrl);
      // imgElement.src = imageUrl;
      // imgElement.style.display = 'block';
      console.log('Image URL:', imageUrl);
    };

    reader.onerror = function () {
      alert('Failed to read the file!');
    };

    reader.readAsDataURL(file);
  }

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
        <div className="uploadPic">
          <input type="file" accept="image/*" id="fileInput" onChange={handleUpload} />
        </div>
        <Image
          width={200}
          src={imageUrl}
        />
      </div>}
      {step === 3 && <div>
        <div style={{ marginBottom: '20px' }}>
          <div>选择大坝等级</div>
          <Radio.Group onChange={onChange} value={radioValue}>
            <Radio value={0}>A</Radio>
            <Radio value={1}>B</Radio>
            <Radio value={2}>C</Radio>
            <Radio value={3}>D</Radio>
          </Radio.Group>
        </div>
        <div>
          请输入水库的累积概率1%的波高(h1%)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} />
        <div>
          波浪中心至正常蓄水位的高度(hz1)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} />
        <div>
          请输入波浪中心线至校核洪水位的高度(hz2)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} />
      </div>}
      {
        step === 4 && <div>
          <Spin />
        </div>
      }
      {
        step === 5 && <div>
          <Image
            width={200}
            src={imageUrl}
          />
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
