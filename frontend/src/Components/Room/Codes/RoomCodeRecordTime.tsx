import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
type codeInfoType = {
  language: string;
  submittedAt: string;
  submittedCode: string;
};

type timesProps = {
  codeList: codeInfoType[];
  setCode: Function;
  setLanguage: Function;
};

function RoomCodeRecordTime({ codeList, setCode, setLanguage }: timesProps) {
  const theme = useTheme();

  // const handleClick = (id: string) => {
  //   setCode()
  // };
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100% - 3vh)',
        background: theme.palette.component,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <span style={{}}>제출시간</span>
      <div style={{ color: theme.palette.txt + '80', fontSize: '0.8rem', marginBottom: '15px' }}>
        * 최대 10개까지 표시됩니다
      </div>
      <div>
        {codeList.map((code, index) => {
          return (
            <Button
              sx={{ color: theme.palette.txt }}
              key={`user-code-${index}`}
              onClick={() => {
                setCode(code.submittedCode);
                setLanguage(code.language === 'python3' ? 'python' : code.language);
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
