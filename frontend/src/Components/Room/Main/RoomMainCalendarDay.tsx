import { alpha, Button, Grid, Stack, styled, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { dateToStringTimeSimple } from '../../../Lib/dateToString';
import { DailySchedule } from './RoomMainCalendar';
import { isMobile } from 'react-device-detect';
import Brightness1Icon from '@mui/icons-material/Brightness1';

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
  minWidth: 0,
}));

function RoomMainCalendarDay({ dailySchedule, nowDay, onClick }: RoomMainCalendarDayProps) {
  const theme = useTheme();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);

  const renderItems = (timeData: DailySchedule) => {
    if (isMobile) {
      return (
        <div>
          <Brightness1Icon sx={{ color: theme.palette.component_accent }}></Brightness1Icon>
        </div>
      );
    }
    return (
      <div>
        <span>{dateToStringTimeSimple(timeData?.schedule?.startedAt)}</span>
        <span>~ {dateToStringTimeSimple(timeData?.schedule?.finishedAt)}</span>
      </div>
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
          </div>
        </Stack>
      </DayBox>
    </Grid>
  );
}

export default RoomMainCalendarDay;
