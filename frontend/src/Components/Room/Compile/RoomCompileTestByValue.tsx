import React from 'react';
import RoomCompileTestByValueItem from './RoomCompileTestByValueItem';

type sampleType = {
  samples: {
    inputValue: string;
    outputValue: string;
    result?: ResultType;
  }[];
};

type ResultType = {
  answer: string;
  isCorrect: Boolean;
  output: string;
};

function RoomCompileTestByValue({ samples }: sampleType) {
  return (
    <>
      {samples.map((sample, idx) => {
        return (
          <RoomCompileTestByValueItem
            key={idx}
            idx={idx + 1}
            inputValue={sample.inputValue}
            outputValue={sample.outputValue}
            result={sample.result}
          />
        );
      })}
    </>
  );
}

export default RoomCompileTestByValue;
