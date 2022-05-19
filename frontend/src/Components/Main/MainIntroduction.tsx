import MainIntroductionContent from './MainIntroductionContent';
import MainIntroductionProfile from './MainIntroductionProfile';
import { styled } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
import { Grid, Stack } from '@mui/material';
const MainIntroductionDiv = styled(Grid)({});

const MMainIntroductionDiv = styled(Stack)({
  paddingTop: 16,
});

function MainIntroduction() {
  return (
    <>
      <BrowserView style={{ width: '100%' }}>
        <MainIntroductionDiv
          container
          sx={{ width: '100%' }}
          spacing={3}
          justifyContent="center"
          alignItems="center">
          <Grid item xs={3} md={3} lg={12}>
            <MainIntroductionProfile />
          </Grid>
          <Grid item xs={9} md={9} lg={12}>
            <MainIntroductionContent />
          </Grid>
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
