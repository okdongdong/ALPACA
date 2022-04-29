import { alpha, Button, Divider, Grid, Stack, styled, useTheme } from '@mui/material';
import { dateToStringTimeSimple } from '../../../Lib/dateToString';
import { DailySchedule } from './RoomMainCalendar';

interface RoomMainCalendarDayProps {
  dailySchedule: DailySchedule;
  nowDay: Date;
  selectedDay: Date;
  setNowDay: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
}

const DayBox = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  width: '100%',
  borderRadius: '10px',
  textAlign: 'center',
  height: theme.spacing(10),
  '&:hover': {
    backgroundColor: theme.palette.accent,
    color: theme.palette.icon,
  },
}));

function RoomMainCalendarDay({
  dailySchedule,
  nowDay,
  selectedDay,
  setNowDay,
  setSelectedDay,
}: RoomMainCalendarDayProps) {
  const theme = useTheme();

  const onClickHandler = () => {
    setSelectedDay(dailySchedule.day);
    setNowDay(dailySchedule.day);
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
        onClick={onClickHandler}>
        <Stack justifyContent="space-between" sx={{ height: '100%', width: '100%' }}>
          <div>{dailySchedule.day.getDate()}</div>
          <Divider variant="middle" sx={{ margin: 0 }} />
          <div
            style={{
              flexGrow: 1,
              width: '100%',
              minHeight: 1,
              alignItems: 'center',
              display: 'flex',
            }}>
            {!!dailySchedule.schedule && (
              <div>
                <span>{dateToStringTimeSimple(dailySchedule.schedule.startedAt)}</span>
                <span>~ {dateToStringTimeSimple(dailySchedule.schedule.finishedAt)}</span>
              </div>
            )}
          </div>
        </Stack>
      </DayBox>
    </Grid>
  );
}

export default RoomMainCalendarDay;
