import React from 'react';
import MainHeatmapChart from '../../Components/Main/MainHeatmapChart';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';

function Main() {
  return (
    <div>
      <MainIntroduction />
      <div style={{ height: '6vh' }}>추천문제</div>
      <div style={{ height: '6vh' }}>이번주 스터디</div>
      <MainRooms />
    </div>
  );
}

export default Main;
