import { IconButton, styled, useTheme } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import React from 'react';
type testProps = {
  idx: number;
  inputValue: string;
  outputValue: string;
  result?: ResultType;
};

type ResultType = {
  answer: string;
  isCorrect: Boolean;
  output: string;
};

const ValueDiv = styled('div')(({ theme }) => ({
  marginLeft: '1.1vw',
  padding: '5px',
  background: theme.palette.bg,
  overflow: 'auto',
  width: '100%',
  maxHeight: '15vh',
  whiteSpace: 'pre',
  fontFamily: "Menlo, Monaco, 'Source Code Pro', consolas, monospace",
}));
const TitleDiv = styled('div')(({ theme }) => ({
  marginTop: '1vh',
  marginLeft: '1.1vw',
  display: 'flex',
  alignItems: 'center',
}));

function RoomCompileTestByValueItem({ idx, inputValue, outputValue, result }: testProps) {
  const theme = useTheme();
  const copyText = (value: string) => {
    navigator.clipboard.writeText(value.replace(/(\\r\\n|\\r|\\n)/g, '\n'));
  };
  return (
    <div style={{ padding: '1.5rem', width: 'calc(100% - 1vw)' }}>
      <div style={{ fontWeight: 600 }}>테스트 {idx}</div>
      <TitleDiv>
        <span>입력값</span>
        <IconButton size="small" onClick={() => copyText(inputValue)}>
          <ContentCopy sx={{ height: '15px', color: theme.palette.txt }} />
        </IconButton>
      </TitleDiv>
      <ValueDiv>{inputValue.replace(/(\\r\\n|\\r|\\n)/g, '\n')}</ValueDiv>
      <TitleDiv>
        <span>출력값</span>
        <IconButton size="small" onClick={() => copyText(outputValue)}>
          <ContentCopy sx={{ height: '15px', color: theme.palette.txt }} />
        </IconButton>
      </TitleDiv>
      <ValueDiv>{outputValue.replace(/(\\r\\n|\\r|\\n)/g, '\n')}</ValueDiv>
      {result && (
        <>
          <TitleDiv>
            <span>실행결과</span>
          </TitleDiv>
          <ValueDiv>
            {result.isCorrect
              ? '맞았습니다!'
              : `기대값 ${result.answer}와 ${result.output}이 다릅니다.`}
          </ValueDiv>
        </>
      )}
    </div>
  );
}

export default RoomCompileTestByValueItem;
