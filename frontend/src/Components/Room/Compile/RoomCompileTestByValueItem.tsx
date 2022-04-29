import React from 'react';
import styles from './RoomCompileTestByValueItem.module.css';
type testProps = {
  idx: number;
  inputValue: string;
  outputValue: string;
  result?: string;
};

function RoomCompileTestByValueItem({ idx, inputValue, outputValue, result }: testProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <tbody>
        <tr>
          <td colSpan={2}>테스트 {idx}</td>
        </tr>
        <tr>
          <td className={styles.td_label} align="right">
            입력값 <span>〉</span>
          </td>
          <td className="input">{inputValue}</td>
        </tr>
        <tr>
          <td className={styles.td_label} align="right">
            기댓값 <span>〉</span>
          </td>
          <td className="output">{outputValue}</td>
        </tr>
        <tr>
          <td className={styles.td_label} align="right" valign="top">
            실행 결과 <span>〉</span>
          </td>
          <td className="result failed">{result}</td>
        </tr>
        <tr style={{ display: 'none' }}>
          <td className={styles.td_label} align="right" valign="top">
            출력 <span>〉</span>
          </td>
          <td className="stdout"></td>
        </tr>
      </tbody>
    </div>
  );
}

export default RoomCompileTestByValueItem;
