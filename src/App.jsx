import './App.css';
import { useEffect, useState } from 'react';
import { Steps, Button, Radio, message, Input, Spin, Image, Collapse } from "antd";
import axios from 'axios';

function App() {
  const [step, setStep] = useState(0);
  const [drawingValue, setDrawingValue] = useState(0);
  const [levelValue, setLevelValue] = useState(0);
  const [accumulationValue, setAccumulationValue] = useState(null);
  const [storageValue, setStorageValue] = useState(null);
  const [floodValue, setFloodValue] = useState(null);
  const [pdfinfo, setPdfinfo] = useState(null);
  const [dwgInfo, setDwgInfo] = useState(null);
  const [res, setRes] = useState([]);

  const next = () => {
    if (step === 2) {
      if (!pdfinfo && !dwgInfo) {
        message.error('请上传文件');
        return
      }
    };
    if (step === 3) {
      if (!accumulationValue || !storageValue || !floodValue) {
        message.error('请补充外界参数');
        return;
      }
      axios.post('http://localhost:5000/handle', {
        pdfinfo: pdfinfo,
        dwgInfo: dwgInfo,
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
          const _temp = response?.data?.result || [];
          const temp = [];
          _temp.forEach((item, index) => {
            temp.push({
              key: index,
              label: <img style={{ width: '400px' }} src={item.path}></img>,
              children: item.info,
            })
          });
          setRes(temp || []);
          console.log(response?.data?.result, 'xxx')
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

  }, []);

  const handleUpload = (info) => {
    // eslint-disable-next-line no-restricted-globals
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const allowedExtensions = ['pdf', 'dwg'];
    const allowedMimeTypes = ['application/pdf', 'application/acad', 'application/x-acad', 'application/autocad_dwg', 'image/vnd.dwg'];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = file.type;

    if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileType)) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const fileUrl = e.target.result;
        if (fileExtension === 'pdf') {
          setPdfinfo(fileUrl);
        }
        if (fileExtension === 'dwg') {
          setDwgInfo(fileUrl);
        }
      };

      reader.onerror = function () {
        alert('Failed to read the file!');
      };

      reader.readAsDataURL(file);
    } else {
      message.error('请上传pdf或dwg格式文件');
    }

  }

  return (
    <div className="App">
      <img src="https://gw.alicdn.com/imgextra/i3/O1CN01kFVvxH1LGAND6TJAe_!!6000000001271-0-tps-5443-3248.jpg" className='img' />
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
          <Collapse items={res} defaultActiveKey={['1']} />
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
