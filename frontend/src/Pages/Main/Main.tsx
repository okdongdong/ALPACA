import React from 'react';
import MainRecommendProblem from '../../Components/Main/MainRecommendProblem';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';
import MainWeeklyCalendar from '../../Components/Main/MainWeeklyCalendar';
import { BrowserView, MobileView } from 'react-device-detect';
import { Grid, Stack } from '@mui/material';

function Main() {
  return (
    <>
      <BrowserView style={{ height: '100%', width: '100%', paddingTop: 40 }}>
        <Grid container sx={{ width: '100%' }}>
          <Grid xs={1}></Grid>
          <Grid xs={2} sx={{ width: '100%', pt: 5 }}>
            <MainIntroduction />
          </Grid>
          <Grid xs={6} sx={{ height: '100%', width: '100%', minWidth: 700 }}>
            <Stack spacing={3} justifyContent="center">
              <MainWeeklyCalendar />
              <MainRecommendProblem />
              <MainRooms />
            </Stack>
          </Grid>
        </Grid>
      </BrowserView>
      <MobileView>
        <Stack spacing={3} justifyContent="center">
          <MainIntroduction />
          <MainWeeklyCalendar />
          <MainRecommendProblem />
          <MainRooms />
        </Stack>
      </MobileView>
    </>
  );
}

export default Main;
