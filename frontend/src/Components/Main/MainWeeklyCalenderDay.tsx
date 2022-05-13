import { alpha, Button, Grid, Stack, styled, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { dateToStringTimeSimple } from '../../Lib/dateToString';
import { DailySchedule } from '../../Redux/roomReducer';

interface RoomMainCalendarDayProps {
  dailySchedule: DailySchedule;
  nowDay: Date;
  onClick: () => void;
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

function MainWeeklyCalenderDay({ dailySchedule, nowDay, onClick }: RoomMainCalendarDayProps) {
  const theme = useTheme();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);

  return (
    <Grid item xs={1}>
      <DayBox
        sx={{
          backgroundColor:
            dailySchedule.day.toLocaleDateString() === selectedDay.toLocaleDateString()
              ? theme.palette.main
              : '',
        }}
        onClick={onClick}>
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

export default MainWeeklyCalenderDay;
