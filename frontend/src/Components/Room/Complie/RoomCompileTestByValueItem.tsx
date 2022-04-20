import React from 'react';

type testProps = {
  idx: number;
  inputValue: string;
  outputValue: string;
  result?: string;
};

function RoomCompileTestByValueItem({ idx, inputValue, outputValue, result }: testProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <div>테스트 {idx}</div>
      <div>
        <span style={{ paddingLeft: '2rem', paddingRight: '1rem' }}>입력값</span>
        <span>{inputValue}</span>
      </div>
      <div>
        <span style={{ paddingLeft: '2rem', paddingRight: '1rem' }}>출력값</span>
        <span>{outputValue}</span>
      </div>
      <div>
        <span style={{ paddingLeft: '2rem', paddingRight: '1rem' }}>실행결과</span>
        <span>{result}</span>
      </div>
    </div>
  );
}

export default RoomCompileTestByValueItem;
