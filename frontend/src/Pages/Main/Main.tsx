import React from 'react';
import MainHeatmapChart from '../../Components/Main/MainHeatmapChart';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';

function Main() {
  return (
    <div>
      <MainIntroduction />
      <MainHeatmapChart />
      <MainRooms />
    </div>
  );
}

export default Main;
