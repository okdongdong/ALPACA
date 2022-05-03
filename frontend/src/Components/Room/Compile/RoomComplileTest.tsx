import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import { Tabs, Tab, Button } from '@mui/material';

import RoomCompileTestByValue from './RoomCompileTestByValue';
import RoomCompileTestByUser from './RoomCompileTestByUser';

const samples = [
  { inputValue: '[1, 2, 3, 10]', outputValue: '6', result: '통과하였습니다' },
  { inputValue: '[1, 2, 3, 10]', outputValue: '6', result: '통과하였습니다' },
  { inputValue: '[1, 2, 3, 10]', outputValue: '6', result: '통과하였습니다' },
];

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
};

function RoomComplileTest({ submitCode }: CompileTestType) {
  const [tab, setTab] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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
            background: '#F2F2F2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <div style={{ width: '100%' }}>
            {tab === 0 ? (
              <RoomCompileTestByValue samples={samples} />
            ) : (
              <RoomCompileTestByUser setUserInput={setUserInput} />
            )}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <CustomButton>코드저장</CustomButton>
            <CustomButton onClick={() => submitCode(tab, tab === 1 && userInput)}>
              코드실행
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomComplileTest;
