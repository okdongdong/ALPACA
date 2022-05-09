import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
const MainIntroductionDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
});

const MMainIntroductionDiv = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

function MainIntroduction() {
  return (
    <>
      <BrowserView>
        <MainIntroductionDiv>
          <MainIntroductionProfile />
          <MainIntroductionContent />
        </MainIntroductionDiv>
      </BrowserView>
      {/* mobile */}
      <MobileView>
        <MMainIntroductionDiv>
          <MainIntroductionProfile />
          <MainIntroductionContent />
        </MMainIntroductionDiv>
      </MobileView>
    </>
  );
}

export default MainIntroduction;
