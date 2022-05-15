import React from 'react';
import MainRecommendProblem from '../../Components/Main/MainRecommendProblem';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';
import MainCalendar from '../../Components/Main/MainCalender';
import MainWeeklyCalendar from '../../Components/Main/MainWeeklyCalender';
import { BrowserView, MobileView } from 'react-device-detect';

function Main() {
  return (
    <>
      <BrowserView>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <MainIntroduction />
            <MainRecommendProblem />
            <MainRooms />
          </div>
          <MainCalendar />
        </div>
      </BrowserView>
      <MobileView>
        <MainIntroduction />
        <MainRecommendProblem />
        <MainWeeklyCalendar />
        <MainRooms />
      </MobileView>
    </>
  );
}

export default Main;