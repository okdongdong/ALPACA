import React from 'react';
import MainRecommendProblem from '../../Components/Main/MainRecommendProblem';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';
import MainWeeklyCalendar from '../../Components/Main/MainWeeklyCalendar';
import { BrowserView, MobileView } from 'react-device-detect';
import { Grid, Stack, styled } from '@mui/material';

const CBox = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    paddingLeft: '10vw',
    paddingRight: '10vw',
  },
}));

function Main() {
  return (
    <>
      <BrowserView style={{ height: '100%', width: '100%', paddingTop: 40 }}>
        <CBox>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={12} lg={1.5}></Grid>
            <Grid item xs={12} lg={2} sx={{ width: '100%', pt: 5 }}>
              <MainIntroduction />
            </Grid>
            <Grid item xs={12} lg={6} sx={{ height: '100%', width: '100%', minWidth: 700 }}>
              <Stack spacing={3} justifyContent="center">
                <MainWeeklyCalendar />
                <MainRecommendProblem />
                <MainRooms />
              </Stack>
            </Grid>
          </Grid>
        </CBox>
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
