import { Button, Grid, Stack, styled, useTheme } from '@mui/material';
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
              : '#aaaaaa',
        }}
        onClick={onClickHandler}>
        <Stack>
          <div>{dailySchedule.day.getDate()}</div>
          <hr />
          {!!dailySchedule.schedule && <span>{dailySchedule.schedule.startedAt.getTime()}</span>}
        </Stack>
      </DayBox>
    </Grid>
  );
}

export default RoomMainCalendarDay;
