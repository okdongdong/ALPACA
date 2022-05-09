import { alpha, Button, Divider, Grid, Stack, styled, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { dateToStringTimeSimple } from '../../../Lib/dateToString';
import { setSelectedDay } from '../../../Redux/roomReducer';
import { DailySchedule } from './RoomMainCalendar';

interface RoomMainCalendarDayProps {
  dailySchedule: DailySchedule;
  nowDay: Date;
  setNowDay: React.Dispatch<React.SetStateAction<Date>>;
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
}));

function RoomMainCalendarDay({ dailySchedule, nowDay, setNowDay }: RoomMainCalendarDayProps) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);

  const onClickHandler = () => {
    console.log('dailySchedule: ', dailySchedule.day);
    dispatch(setSelectedDay(new Date(dailySchedule.day)));
    setNowDay(new Date(dailySchedule.day));
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
          <div style={{ color: 'rgba(0,0,0,0.5)', textAlign: 'left' }}>
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
            {!!dailySchedule.schedule && (
              <div>
                <span>{dateToStringTimeSimple(new Date(dailySchedule.schedule.startedAt))}</span>
                <span>~ {dateToStringTimeSimple(new Date(dailySchedule.schedule.finishedAt))}</span>
              </div>
            )}
          </div>
        </Stack>
      </DayBox>
    </Grid>
  );
}

export default RoomMainCalendarDay;
