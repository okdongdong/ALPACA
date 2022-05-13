import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Grid, IconButton, Stack, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { customAxios } from '../../Lib/customAxios';
import { Schedule, setDailySchedule, setDateRange, setSchedules } from '../../Redux/roomReducer';
import RoomMainCalendarDay from '../Room/Main/RoomMainCalendarDay';
import RoomMainCalendarWeek from '../Room/Main/RoomMainCalendarWeek';

export interface DailySchedule {
  day: Date;
  schedule?: Schedule;
}

const CalendarTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  paddingRight: theme.spacing(1),
}));

const CalendarBox = styled(Grid)(({ theme }) => ({
  background: theme.palette.component,
  marginLeft: 0,
  marginTop: 0,
  width: '100%',
  paddingRight: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: '0 0 10px 10px',
}));

function MainWeeklyCalendar() {
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  const dateRange = useSelector((state: any) => state.room.dateRange);
  const schedules = useSelector((state: any) => state.room.schedules);

  // 현재 보고 있는 달력의 달을 확인하기 위한 변수
  const [nowDay, setNowDay] = useState<Date>(new Date());

  // 현재 달력의 날짜계산 및 스케줄저장을 위한 함수
  const getStartDate = () => {
    const startDate = new Date(nowDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const tempDateRange = [];

    for (let i = 0; i < 7; i++) {
      const temp: DailySchedule = {
        day: new Date(startDate),
      };

      tempDateRange.push(temp);
      startDate.setDate(startDate.getDate() + 1);
    }
    console.log('schedules: ', schedules);
    dispatch(setDateRange(tempDateRange));
    return startDate;
  };

  // 달이 변할때 스케줄을 가져오는 함수
  const getWeeklySchedule = async () => {
    const startDate = getStartDate();
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/span`,
        params: {
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
        },
      });
      console.log('change month: ', res);
      const tempSchedules: Schedule[] = [];
      res.data.forEach((schedule: Schedule) => {
        const startedAt = new Date(schedule.startedAt);
        const finishedAt = new Date(schedule.finishedAt);

        tempSchedules.push({ id: schedule.id, startedAt, finishedAt });
      });

      dispatch(setSchedules([...tempSchedules]));
    } catch (e: any) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    getWeeklySchedule();
  }, [nowDay]);

  useEffect(() => {
    getStartDate();
  }, []);

  useEffect(() => {
    dispatch(setDailySchedule());
  }, [schedules]);

  return (
    <Stack>
      <CalendarTitle>
        <IconButton
          size="large"
          onClick={() => setNowDay((prev) => new Date(prev.setDate(prev.getDate() - 7)))}>
          <ArrowBackIosNew />
        </IconButton>
        <div style={{ textAlign: 'center' }}>
          <span>{nowDay.getFullYear()}년</span>
          <h3>
            {nowDay.getMonth() + 1}월{' '}
            {Math.floor((nowDay.getDate() + (7 - nowDay.getDay())) / 7) + 1}
            번째 주
          </h3>
        </div>
        <IconButton
          size="large"
          onClick={() => setNowDay((prev) => new Date(prev.setDate(prev.getDate() + 7)))}>
          <ArrowForwardIos />
        </IconButton>
      </CalendarTitle>
      <RoomMainCalendarWeek />
      <CalendarBox
        container
        columns={7}
        spacing={1}
        sx={{ paddingLeft: 0, paddingTop: theme.spacing(1) }}>
        {dateRange.map((dailySchedule: DailySchedule, idx: number) => (
          <RoomMainCalendarDay
            dailySchedule={dailySchedule}
            key={idx}
            nowDay={nowDay}
            onClick={() => {}}
          />
        ))}
      </CalendarBox>
    </Stack>
  );
}

export default MainWeeklyCalendar;
