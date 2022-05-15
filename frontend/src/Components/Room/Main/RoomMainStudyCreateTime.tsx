import React, { useEffect, useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Input, styled, TextField, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { dateToStringDate } from '../../../Lib/dateToString';
import { useDispatch, useSelector } from 'react-redux';
import { setFinishedAt, setStartedAt } from '../../../Redux/roomReducer';
import RoomMainStudyCreateTimeInput from './RoomMainStudyCreateTimeInput';

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
const CTimeInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

function RoomMainStudyCreateTime() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const [selectedTime, setSelectedTime] = useState<any>();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setSelectedTime(event.target.value);
  };

  // 시작시간을 종료시간보다 더 늦게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      dispatch(setFinishedAt(new Date(startedAt)));
    }
  }, [startedAt]);

  // 종료시간을 시작시간보다 더 빠르게 설정했을 때
  useEffect(() => {
    if (!!startedAt && !!finishedAt && startedAt.getTime() > finishedAt.getTime()) {
      dispatch(setStartedAt(new Date(finishedAt)));
    }
  }, [finishedAt]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimeContainer>
        <TimeBox>
          <DateBox>일시: {dateToStringDate(selectedDay)}</DateBox>
          <RoomMainStudyCreateTimeInput />
          {/* <CTimeInput type="text" onChange={onChangeHandler} /> */}
          {/* <TimePicker
            value={startedAt}
            onChange={(e) => dispatch(setStartedAt(e))}
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
            onChange={(e) => dispatch(setFinishedAt(e))}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ width: '50%', backgroundColor: theme.palette.bg, marginLeft: 1 }}
              />
            )}
          /> */}
        </TimeBox>
      </TimeContainer>
    </LocalizationProvider>
  );
}

export default RoomMainStudyCreateTime;
