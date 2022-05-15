import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Grid, styled, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { dateToStringDate, dateToStringTimeSimple } from '../../../Lib/dateToString';
import { useDispatch, useSelector } from 'react-redux';
import { setFinishedAt, setStartedAt } from '../../../Redux/roomReducer';

const TimeContainer = styled('div')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
}));

const DateBox = styled('div')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  marginBottom: theme.spacing(2),
}));

const CustomInput = styled(TextField)(({ theme }) => ({
  color: theme.palette.txt,
  backgroundColor: theme.palette.bg,
  width: '100%',
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
  '& input': { padding: 10, color: theme.palette.txt },
}));

function RoomMainStudyCreateTime() {
  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);

  const [startedTime, setStartedTime] = useState<string>(dateToStringTimeSimple(new Date()));
  const [finishedTime, setFinishedTime] = useState<string>(dateToStringTimeSimple(new Date()));

  const onChangeStartedAtHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempDate = new Date();
    setStartedTime(event.target.value);
    const [hours, minutes] = event.target.value.split(':');
    tempDate.setHours(parseInt(hours), parseInt(minutes));
    if (!!finishedAt && tempDate.getTime() > finishedAt.getTime()) {
      // 시작시간을 종료시간보다 더 늦게 설정했을 때
      dispatch(setFinishedAt(new Date(tempDate)));
      setFinishedTime(event.target.value);
    }
    dispatch(setStartedAt(new Date(tempDate)));
  };

  const onChangeFinishedAtHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempDate = new Date();
    setFinishedTime(event.target.value);
    const [hours, minutes] = event.target.value.split(':');
    tempDate.setHours(parseInt(hours), parseInt(minutes));
    if (!!startedAt && tempDate.getTime() < startedAt.getTime()) {
      // 종료시간을 시작시간보다 더 빠르게 설정했을 때
      dispatch(setStartedAt(new Date(finishedAt)));
      setStartedTime(event.target.value);
    }
    dispatch(setFinishedAt(new Date(tempDate)));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimeContainer>
        <DateBox>일시: {dateToStringDate(selectedDay)}</DateBox>
        <Grid container alignItems="center">
          <Grid item xs={10} xl={5}>
            <CustomInput type="time" value={startedTime} onChange={onChangeStartedAtHandler} />
          </Grid>
          <Grid item xs={2} xl={0.5}></Grid>
          <Grid item xs={1.5} xl={1}>
            ~
          </Grid>
          <Grid item xs={0.5} xl={0.5}></Grid>
          <Grid item xs={10} xl={5}>
            <CustomInput type="time" value={finishedTime} onChange={onChangeFinishedAtHandler} />
          </Grid>
        </Grid>
      </TimeContainer>
    </LocalizationProvider>
  );
}

export default RoomMainStudyCreateTime;
