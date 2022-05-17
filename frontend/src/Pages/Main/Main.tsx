import React from 'react';
import MainRecommendProblem from '../../Components/Main/MainRecommendProblem';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';
import MainWeeklyCalendar from '../../Components/Main/MainWeeklyCalendar';
import { BrowserView, MobileView } from 'react-device-detect';

function Main() {
  return (
    <>
      <BrowserView>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <MainIntroduction />
            <MainWeeklyCalendar />
            <MainRecommendProblem />
            <MainRooms />
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <MainIntroduction />
        <MainWeeklyCalendar />
        <MainRecommendProblem />
        <MainRooms />
      </MobileView>
    </>
  );
}

export default Main;
