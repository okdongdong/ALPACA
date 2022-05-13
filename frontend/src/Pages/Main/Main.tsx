import React from 'react';
import MainRecommendProblem from '../../Components/Main/MainRecommendProblem';
import MainIntroduction from '../../Components/Main/MainIntroduction';
import MainRooms from '../../Components/Main/MainRooms';

function Main() {
  return (
    <div>
      <MainIntroduction />
      <MainRecommendProblem />
      <MainRooms />
    </div>
  );
}

export default Main;
