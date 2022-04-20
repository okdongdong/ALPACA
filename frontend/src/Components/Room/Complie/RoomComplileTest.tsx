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
// type Cu = {
//   children?: React.ReactNode;
//   value: number;
//   onChange: (event: React.SyntheticEvent, newValue: number) => void;
// };

// type Cy {
//   label: string;
// }

const CustomTab = styled(Tab)({
  background: '#c4c4c4',
  borderRadius: '10px 10px 0 0',
  color: '#FFFFFF',
  fontFamily: 'Pretendard-Regular',
  '&.Mui-selected': {
    color: '#FFFFFF',
    background: '#3C5FAE',
  },
});

function RoomComplileTest() {
  const [tab, setTab] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setTab(newValue);
  };
  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Tabs
          sx={{ height: '3vh' }}
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example">
          <CustomTab label="코드실행" />
          <CustomTab label="테스트" />
        </Tabs>
        <div
          style={{
            height: 'calc(100% - 67px)',
            background: '#F2F2F2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <div style={{ width: '100%' }}>
            {tab == 0 ? <RoomCompileTestByValue samples={samples} /> : <RoomCompileTestByUser />}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button>코드저장</Button>
            <Button>코드실행</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomComplileTest;
