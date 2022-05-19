import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
import { Stack } from '@mui/material';
const MainIntroductionDiv = styled(Stack)({
  paddingRight: 24,
});

const MMainIntroductionDiv = styled(Stack)({
  paddingTop: 16,
});

function MainIntroduction() {
  return (
    <>
      <BrowserView style={{ width: '100%' }}>
        <MainIntroductionDiv spacing={3} justifyContent="center" alignItems="center">
          <MainIntroductionProfile />
          <MainIntroductionContent />
        </MainIntroductionDiv>
      </BrowserView>

      <MobileView>
        <MMainIntroductionDiv direction="row" alignItems="center">
          <MainIntroductionProfile />
          <MainIntroductionContent />
        </MMainIntroductionDiv>
      </MobileView>
    </>
  );
}

export default MainIntroduction;
