import { Grid, styled } from '@mui/material';

const WeekBox = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: theme.spacing(5),
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
  paddingRight: theme.spacing(1),
}));

function RoomMainCalendarWeek() {
  const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Grid container columns={7} columnSpacing={1}>
      {weekDay.map((day, idx) => (
        <WeekBox item xs={1} key={idx}>
          {day}
        </WeekBox>
      ))}
    </Grid>
  );
}

export default RoomMainCalendarWeek;
