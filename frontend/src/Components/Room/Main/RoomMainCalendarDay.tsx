import { alpha, Button, Collapse, Grid, Stack, styled, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { DailySchedule } from './RoomMainCalendar';
import { MainDailySchedule } from '../../Main/MainWeeklyCalendar';
import { isMobile } from 'react-device-detect';
import Brightness1Icon from '@mui/icons-material/Brightness1';

interface RoomMainCalendarDayProps {
  dailySchedule: DailySchedule;
  mainDailySchedule?: MainDailySchedule;
  nowDay: Date;
  onClick: (event?: any) => void;
}

const DayBox = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  width: '100%',
  borderRadius: '10px',
  textAlign: 'center',
  height: theme.spacing(8),
  '&:hover': {
    backgroundColor: theme.palette.accent,
    color: theme.palette.icon,
  },
  minWidth: 0,
}));

function RoomMainCalendarDay({
  mainDailySchedule,
  dailySchedule,
  nowDay,
  onClick,
}: RoomMainCalendarDayProps) {
  const theme = useTheme();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);

  const renderItems = (timeData: DailySchedule) => {
    if (!!mainDailySchedule) {
      let items = [];
      for (let i = 0; i < Math.min(mainDailySchedule.schedules.length, isMobile ? 3 : 5); i++) {
        items.push(
          <Brightness1Icon
            key={mainDailySchedule.schedules[i].id}
            sx={{
              color: theme.palette.component_accent,
              fontSize: isMobile ? '2vw' : '14px',
            }}></Brightness1Icon>,
        );
      }
      return items;
    }
    if (isMobile) {
      return (
        <div>
          <Brightness1Icon sx={{ color: theme.palette.component_accent }}></Brightness1Icon>
        </div>
      );
    }
    return (
      <div>
        <Brightness1Icon sx={{ color: theme.palette.component_accent }}></Brightness1Icon>
      </div>
      // <div>
      //   <span>{dateToStringTimeSimple(timeData?.schedule?.startedAt)}</span>
      //   <span>~ {dateToStringTimeSimple(timeData?.schedule?.finishedAt)}</span>
      // </div>
    );
  };

  return (
    <Grid item xs={1}>
      <DayBox
        sx={{
          backgroundColor:
            dailySchedule.day.toLocaleDateString() === selectedDay.toLocaleDateString()
              ? theme.palette.main
              : dailySchedule.day.getMonth() === nowDay.getMonth()
              ? ''
              : alpha(theme.palette.bg, 0.6),
        }}
        onClick={onClick}>
        <Stack justifyContent="space-between" sx={{ height: '100%', width: '100%' }}>
          <div style={{ color: theme.palette.txt, textAlign: 'left' }}>
            {dailySchedule.day.getMonth() === nowDay.getMonth() ||
              `${dailySchedule.day.getMonth() + 1}/`}
            {dailySchedule.day.getDate()}
          </div>
          <div
            style={{
              flexGrow: 1,
              width: '100%',
              minHeight: 1,
              alignItems: 'center',
              display: 'flex',
            }}>
            {!!dailySchedule.schedule && <div>{renderItems(dailySchedule)}</div>}
            {!!mainDailySchedule && <div>{renderItems(dailySchedule)}</div>}
          </div>
        </Stack>
      </DayBox>
      <Collapse></Collapse>
    </Grid>
  );
}

export default RoomMainCalendarDay;
