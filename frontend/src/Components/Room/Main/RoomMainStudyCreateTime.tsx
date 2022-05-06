import React, { useEffect } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled, TextField, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { dateToStringDate } from '../../../Lib/dateToString';

interface RoomMainStudyCreateTimeProps {
  selectedDay: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setFinishedAt: React.Dispatch<React.SetStateAction<Date | null>>;
}

const TimeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  textAlign: 'center',
}));
const DateBox = styled('div')(({ theme }) => ({ width: '50%' }));
const TimeBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
}));

function RoomMainStudyCreateTime({
  selectedDay,
  startedAt,
  finishedAt,
  setStartedAt,
  setFinishedAt,
}: RoomMainStudyCreateTimeProps) {
  const theme = useTheme();

  // 시작시간을 종료시간보다 더 늦게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      setFinishedAt(startedAt);
    }
  }, [startedAt]);

  // 종료시간을 시작시간보다 더 빠르게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      setStartedAt(finishedAt);
    }
  }, [finishedAt]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimeContainer>
        <TimeBox>
          <DateBox>일시: {dateToStringDate(selectedDay)}</DateBox>
          <TimePicker
            value={startedAt}
            onChange={setStartedAt}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ width: '50%', backgroundColor: theme.palette.bg, marginRight: 1 }}
              />
            )}
          />
          ~
          <TimePicker
            value={finishedAt}
            onChange={setFinishedAt}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ width: '50%', backgroundColor: theme.palette.bg, marginLeft: 1 }}
              />
            )}
          />
        </TimeBox>
      </TimeContainer>
    </LocalizationProvider>
  );
}

export default RoomMainStudyCreateTime;
