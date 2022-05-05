import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import { Tabs, Tab, Button, useTheme } from '@mui/material';

import RoomCompileTestByValue from './RoomCompileTestByValue';
import RoomCompileTestByUser from './RoomCompileTestByUser';

type CustomTabsProps = {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
};

const CustomTabs = styled((props: CustomTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#transparent',
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  background: '#c4c4c4',
  borderRadius: '10px 10px 0 0',
  color: theme.palette.icon,
  fontFamily: 'Pretendard-Regular',
  '&.Mui-selected': {
    color: theme.palette.icon,
    background: theme.palette.accent,
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.txt,
  fontFamily: 'Pretendard-Regular',
  margin: '5px',
  paddingLeft: '10px',
  paddingReft: '10px',
  '&:hover': {
    background: theme.palette.main,
  },
}));

type CompileTestType = {
  submitCode: Function;
  saveCode: Function;
  inputs: string[];
  outputs: string[];
};

type ResultType = {
  answer: string;
  isCorrect: Boolean;
  output: string;
};

function RoomComplileTest({ submitCode, saveCode, inputs, outputs }: CompileTestType) {
  const theme = useTheme();
  const [tab, setTab] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [userOutput, setUserOutput] = useState<string>('');
  const [userResult, setUserResult] = useState<ResultType[]>();
  useEffect(() => {
    setUserOutput('');
  }, [tab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSubmitCode = async () => {
    const res = await submitCode(tab, tab === 1 && userInput);
    if (!res) return;
    if (tab === 0) {
      setUserResult(
        res.map((result: any) => {
          return {
            answer: result.answer,
            isCorrect: result.isCorrect,
            output: result.output,
          };
        }),
      );
    } else {
      setUserOutput(res.output);
    }
  };

  const handleSaveCode = () => {
    saveCode();
  };
  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <CustomTabs
          sx={{ height: '3vh' }}
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example">
          <CustomTab label="코드실행" />
          <CustomTab label="테스트" />
        </CustomTabs>
        <div
          style={{
            height: 'calc(100% - 67px)',
            background: theme.palette.component,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <div style={{ width: '100%', maxHeight: '72vh', overflow: 'auto' }}>
            {tab === 0 ? (
              <RoomCompileTestByValue
                samples={inputs.map((input, idx) => {
                  return {
                    inputValue: input,
                    outputValue: outputs[idx],
                    result: userResult && userResult[idx],
                  };
                })}
              />
            ) : (
              <RoomCompileTestByUser setUserInput={setUserInput} output={userOutput} />
            )}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <CustomButton onClick={handleSaveCode}>코드저장</CustomButton>
            <CustomButton onClick={handleSubmitCode}>코드실행</CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomComplileTest;
