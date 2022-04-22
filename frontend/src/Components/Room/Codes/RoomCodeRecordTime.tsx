import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
type timesProps = {
  times: { time: string; id: number }[];
  setCode: Function;
};

function RoomCodeRecordTime({ times, setCode }: timesProps) {
  const theme = useTheme();

  const handleClick = (id: number) => {
    console.log(id);
  };
  return (
    <div style={{ width: '100%', height: 'calc(100% - 3vh)', background: theme.palette.component }}>
      <span>제출시간</span>
      <div>
        {times.map((time, index) => {
          return (
            <Button
              key={index}
              onClick={() => {
                handleClick(time.id);
              }}>
              {time.time}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default RoomCodeRecordTime;
