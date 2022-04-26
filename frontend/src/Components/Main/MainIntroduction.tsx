import React from 'react';
import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';

const MainIntroductionDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function MainIntroduction() {
  const [userData, setUserData] = React.useState<any[]>();
  console.log(userData);
  return (
    <MainIntroductionDiv>
      <MainIntroductionProfile callback={setUserData} />
      <MainIntroductionContent userdata={userData} />
    </MainIntroductionDiv>
  );
}

export default MainIntroduction;
