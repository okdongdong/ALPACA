import { Grid, styled } from '@mui/material';

const WEEK_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeekContainer = styled(Grid)(({ theme }) => ({
  borderRadius: '10px 10px 0 0',
  backgroundColor: theme.palette.accent,
  paddingRight: theme.spacing(1),

  color: theme.palette.icon,
}));

const WeekBox = styled(Grid)(({ theme }) => ({
  height: theme.spacing(5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

function RoomMainCalendarWeek() {
  return (
    <WeekContainer container columns={7} columnSpacing={1}>
      {WEEK_DAY.map((day, idx) => (
        <WeekBox item xs={1} key={idx}>
          {day}
        </WeekBox>
      ))}
    </WeekContainer>
  );
}

export default RoomMainCalendarWeek;
