import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';

const MainIntroductionDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function MainIntroduction() {
  return (
    <MainIntroductionDiv>
      <MainIntroductionProfile />
      <MainIntroductionContent />
    </MainIntroductionDiv>
  );
}

export default MainIntroduction;
