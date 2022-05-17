import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Grid, IconButton, Stack, styled, useTheme, Popover } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { customAxios } from '../../Lib/customAxios';
import { isMobile } from 'react-device-detect';
import { dateToStringTimeSimple } from '../../Lib/dateToString';
import {
  Schedule,
  setWeeklyDateRange,
  setWeeklySchedule,
  setSchedules,
  setSelectedDay,
} from '../../Redux/roomReducer';
import RoomMainCalendarDay from '../Room/Main/RoomMainCalendarDay';
import RoomMainCalendarWeek from '../Room/Main/RoomMainCalendarWeek';
import CBtn from '../Commons/CBtn';

export interface MainDailySchedule {
  day: Date;
  schedules: Schedule[];
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  maxWidth: isMobile ? 400 : 500,
  padding: theme.spacing(isMobile ? 2 : 3),
}));

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
  const navigate = useNavigate();

  const weeklyDateRange = useSelector((state: any) => state.room.weeklyDateRange);
  const schedules = useSelector((state: any) => state.room.schedules);

  // 현재 보고 있는 달력의 달을 확인하기 위한 변수
  const [nowDay, setNowDay] = useState<Date>(new Date());

  //Popover anchorEl
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule[]>([]);
  // 현재 달력의 날짜계산 및 스케줄저장을 위한 함수
  const getStartDate = () => {
    const startDate = new Date(nowDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const tempDateRange = [];

    for (let i = 0; i < 7; i++) {
      const temp: MainDailySchedule = {
        day: new Date(startDate),
        schedules: [],
      };

      tempDateRange.push(temp);
      startDate.setDate(startDate.getDate() + 1);
    }
    dispatch(setWeeklyDateRange(tempDateRange));
    return new Date(nowDay);
  };

  // 달이 변할때 스케줄을 가져오는 함수
  const getWeeklySchedule = async () => {
    const startDate = getStartDate();
    try {
      console.log(startDate);
      const res = await customAxios({
        method: 'get',
        url: `/study/span`,
        params: {
          year: startDate.getFullYear(),
          month: startDate.getMonth() + 1,
          day: startDate.getDate(),
          offset: 0,
        },
      });
      console.log('change week: ', res);
      const tempSchedules: Schedule[] = [];
      res.data.forEach((schedule: Schedule) => {
        const startedAt = new Date(schedule.startedAt);
        const finishedAt = new Date(schedule.finishedAt);

        tempSchedules.push({
          id: schedule.id,
          startedAt,
          finishedAt,
          studyId: schedule.studyId,
          studyTitle: schedule.studyTitle,
        });
      });
      dispatch(setSchedules([...tempSchedules]));
    } catch (e: any) {
      console.log(e.response);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedSchedule([]);
    dispatch(setSelectedDay(new Date(1, 1, 1)));
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    getWeeklySchedule();
  }, [nowDay]);

  useEffect(() => {
    getStartDate();
  }, []);

  useEffect(() => {
    dispatch(setWeeklySchedule());
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
            {nowDay.getMonth() + 1}월 {Math.floor((nowDay.getDate() + (7 - nowDay.getDay())) / 7)}
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
        {weeklyDateRange.map((dailySchedule: MainDailySchedule, idx: number) => (
          <RoomMainCalendarDay
            dailySchedule={dailySchedule}
            mainDailySchedule={dailySchedule}
            key={idx}
            nowDay={nowDay}
            onClick={(event) => {
              dispatch(setSelectedDay(dailySchedule.day));
              setSelectedSchedule(dailySchedule.schedules);
              handleOpen(event);
            }}
          />
        ))}
      </CalendarBox>
      <Popover
        open={Boolean(anchorEl) && !!selectedSchedule.length}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { margin: isMobile ? 0 : '' } }}>
        <CustomBox spacing={2}>
          {selectedSchedule.map((schedule, idx) => {
            return (
              <>
                <div key={`${schedule.id}-${idx}`}>
                  <span style={{ marginRight: 20, maxWidth: 200, textOverflow: 'ellipsis' }}>
                    {schedule.studyTitle}
                  </span>
                  <span>{dateToStringTimeSimple(schedule.startedAt)}</span> ~
                  <span> {dateToStringTimeSimple(schedule.finishedAt)}</span>
                  <span style={{ marginLeft: 20 }}>
                    <CBtn onClick={() => navigate(`/room/${schedule.studyId}`)}>이동</CBtn>
                  </span>
                </div>
              </>
            );
          })}
        </CustomBox>
      </Popover>
    </Stack>
  );
}

export default MainWeeklyCalendar;
