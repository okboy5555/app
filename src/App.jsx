import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import { useState } from 'react';

function App() {
  const [step, setStep] = useState(0);

  const next = () => {
    setStep(step + 1);
  };

  return (
    <div className="App">
      {step === 0 && <div>0</div>}
      {step === 1 && <div>1</div>}
      {step === 2 && <div>2</div>}
      <Button onClick={next}>下一步</Button>
    </div>
  );
}

export default App;
