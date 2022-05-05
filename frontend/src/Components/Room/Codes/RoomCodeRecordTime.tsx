import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
type codeInfoType = {
  id: string;
  language: string;
  problemNumber: number;
  submittedAt: string;
  submittedCode: string;
  userId: number;
};

type timesProps = {
  codeList: codeInfoType[];
  setCode: Function;
};

function RoomCodeRecordTime({ codeList, setCode }: timesProps) {
  const theme = useTheme();

  // const handleClick = (id: string) => {
  //   setCode()
  // };
  return (
    <div style={{ width: '100%', height: 'calc(100% - 3vh)', background: theme.palette.component }}>
      <span>제출시간</span>
      <div>
        {codeList.map((code, index) => {
          return (
            <Button
              key={`user-code-${index}`}
              onClick={() => {
                setCode(code.submittedCode);
              }}>
              {code.submittedAt}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default RoomCodeRecordTime;
