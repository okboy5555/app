import './App.css';
import { useEffect, useState } from 'react';
import { Steps, Button, Radio, message, Input, Spin, Image } from "antd";
import axios from 'axios';

function App() {
  const [step, setStep] = useState(0);
  const [drawingValue, setDrawingValue] = useState(0);
  const [levelValue, setLevelValue] = useState(0);
  const [accumulationValue, setAccumulationValue] = useState(null);
  const [storageValue, setStorageValue] = useState(null);
  const [floodValue, setFloodValue] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [res, setRes] = useState([]);

  const next = () => {
    if (step === 2) {
      if (!imageUrl || imageUrl === '') {
        message.error('请上传图片');
        return
      }
    };
    if (step === 3) {
      if (!accumulationValue || !storageValue || !floodValue) {
        message.error('请补充外界参数');
        return;
      }
      axios.post('http://localhost:5000/handle', {
        pdfinfo: imageUrl,
        tyoe: drawingValue,
        level: levelValue,
        numberone: accumulationValue,
        numbertwo: storageValue,
        numberthree: floodValue
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
        .then(response => {
          setRes(response?.data?.result || []);
          setStep(5);
        })
        .catch(error => {
          setStep(5);
          message.error('Upload failed!');
        });
    }
    setStep(step + 1);
  };

  const onDrawingChange = (e) => {
    setDrawingValue(e.target.value);
  };

  const onLevelChange = (e) => {
    setLevelValue(e.target.value)
  }

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

    // if (!file.type.startsWith('image/')) {
    //   alert('Please upload an image file.');
    //   return;
    // }

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
        <Radio.Group onChange={onDrawingChange} value={drawingValue}>
          <Radio value={0}>水利图纸</Radio>
          <Radio value={1}>电气图纸</Radio>
        </Radio.Group></div>}
      {step === 2 && <div>
        <div className="uploadPic">
          <div style={{ marginBottom: '20px' }}>选择图纸</div>
          <input type="file" id="fileInput" onChange={handleUpload} />
        </div>
        {imageUrl && <Image
          width={200}
          src={imageUrl}
        />}
      </div>}
      {step === 3 && <div>
        <div style={{ marginBottom: '20px' }}>
          <div>选择大坝等级</div>
          <Radio.Group onChange={onLevelChange} value={levelValue}>
            <Radio value={0}>1</Radio>
            <Radio value={1}>2</Radio>
            <Radio value={2}>3</Radio>
          </Radio.Group>
        </div>
        <div>
          请输入水库的累积概率1%的波高(h1%)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} value={accumulationValue} onChange={(e) => setAccumulationValue(e.target.value)} />
        <div>
          波浪中心至正常蓄水位的高度(hz1)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} value={storageValue} onChange={(e) => setStorageValue(e.target.value)} />
        <div>
          请输入波浪中心线至校核洪水位的高度(hz2)
        </div>
        <Input placeholder="" style={{ marginBottom: '20px' }} value={floodValue} onChange={(e) => setFloodValue(e.target.value)} />
      </div>}
      {
        step === 4 && <div>
          <Spin />
        </div>
      }
      {
        step === 5 && <div>
          {/* <Image
            width={200}
            src={imageUrl}
          /> */}
          {
            res.map((item) => {
              <Image src={item?.path}></Image>
            })
          }
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
