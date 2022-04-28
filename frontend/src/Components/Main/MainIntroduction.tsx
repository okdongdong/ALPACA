import React from 'react';
import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const MainIntroductionDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function MainIntroduction() {
  const userInfo = useSelector((state: any) => state.account);
  const [userData, setUserData] = React.useState<any[]>();
  console.log(userInfo);
  return (
    <MainIntroductionDiv>
      <MainIntroductionProfile callback={setUserData} />
      <MainIntroductionContent userdata={userData} />
    </MainIntroductionDiv>
  );
}

export default MainIntroduction;
