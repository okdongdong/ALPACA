import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Grid, IconButton, Stack, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Schedule } from '../../../Pages/Room/RoomMain';
import RoomMainCalendarDay from './RoomMainCalendarDay';
import RoomMainCalendarWeek from './RoomMainCalendarWeek';

interface RoomMainCalendarProps {
  schedules: Schedule[];
  selectedDay: Date;
  dateRange: DailySchedule[];
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
  setDateRange: React.Dispatch<React.SetStateAction<DailySchedule[]>>;
}

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
  width:'100%',
  paddingRight: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: '0 0 10px 10px',
}));

function RoomMainCalendar({
  schedules = [],
  selectedDay,
  dateRange,
  setSelectedDay,
  setDateRange,
}: RoomMainCalendarProps) {
  // 현재 보고 있는 달력의 달을 확인하기 위한 변수
  const theme = useTheme();
  const [nowDay, setNowDay] = useState<Date>(new Date());

  // 현재 달력의 날짜계산 및 스케줄저장을 위한 함수
  const getStartDate = () => {
    const startDate = new Date();
    startDate.setMonth(nowDay.getMonth());
    startDate.setDate(1);
    startDate.setDate(-startDate.getDay() + 1);

    const tempDateRange = [];
    let scheduleIdx = 0;

    for (let i = 0; i < 42; i++) {
      const temp: DailySchedule = {
        day: new Date(startDate),
      };

      if (scheduleIdx < schedules.length) {
        console.log('schedules.length:', schedules.length);
        let scheduleDay = new Date(schedules[scheduleIdx].startedAt);
        if (
          temp.day.getFullYear() === scheduleDay.getFullYear() &&
          temp.day.getMonth() === scheduleDay.getMonth() &&
          temp.day.getDate() === scheduleDay.getDate()
        ) {
          temp.schedule = schedules[scheduleIdx++];
        }
      }
      tempDateRange.push(temp);
      startDate.setDate(startDate.getDate() + 1);
    }
    setDateRange(tempDateRange);
  };

  useEffect(() => {
    getStartDate();
  }, [nowDay, schedules]);

  return (
    <Stack>
      <CalendarTitle>
        <IconButton
          size="large"
          onClick={() => setNowDay((prev) => new Date(prev.setMonth(prev.getMonth() - 1)))}>
          <ArrowBackIosNew />
        </IconButton>
        <div style={{ textAlign: 'center' }}>
          <span>{nowDay.getFullYear()}년</span>
          <h3>{nowDay.getMonth() + 1}월</h3>
        </div>
        <IconButton
          size="large"
          onClick={() => setNowDay((prev) => new Date(prev.setMonth(prev.getMonth() + 1)))}>
          <ArrowForwardIos />
        </IconButton>
      </CalendarTitle>
      <RoomMainCalendarWeek />
      <CalendarBox
        container
        columns={7}
        spacing={1}
        sx={{ paddingLeft: 0, paddingTop: theme.spacing(1) }}>
        {dateRange.map((dailySchedule, idx) => (
          <RoomMainCalendarDay
            dailySchedule={dailySchedule}
            key={idx}
            nowDay={nowDay}
            setNowDay={setNowDay}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        ))}
      </CalendarBox>
    </Stack>
  );
}

export default RoomMainCalendar;
