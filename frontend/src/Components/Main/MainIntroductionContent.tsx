import { useSelector } from 'react-redux';
import { Input } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';

const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
}));

const CustomContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.component,
  color: theme.palette.txt,
  borderRadius: 10,
  padding: theme.spacing(1),
  marginTop: '3px',
  marginBottom: '3px',
}));

const TInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const IntroductionDiv = styled('div')({
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'flex-end',
});

function MainIntroductionContent() {
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  return (
    <>
      <BrowserView>
        <IntroductionDiv>
          <div>
            <Clabel htmlFor="">닉네임</Clabel>
          </div>
          <CustomContainer>
            <TInput sx={{ width: 500, marginBottom: '5px' }} value={userInfo.nickname}></TInput>
          </CustomContainer>
          <div>
            <Clabel htmlFor="">자기소개</Clabel>
          </div>
          <CustomContainer>
            <TInput sx={{ width: 500 }} value={userInfo.info} multiline maxRows={4}></TInput>
          </CustomContainer>
        </IntroductionDiv>
      </BrowserView>
      <MobileView>
        <IntroductionDiv sx={{ marginRight: '10px' }}>
          <div style={{ marginTop: '1vh' }}>
            <Clabel htmlFor="">닉네임</Clabel>
          </div>
          <CustomContainer sx={{ marginBottom: '1vh' }}>
            <TInput sx={{ width: '100%', minWidth: '230px' }} value={userInfo.nickname}></TInput>
          </CustomContainer>
          <div>
            <Clabel htmlFor="">자기소개</Clabel>
          </div>
          <CustomContainer sx={{ marginBottom: '1vh' }}>
            <TInput sx={{ width: '100%' }} value={userInfo.info} multiline maxRows={4}></TInput>
          </CustomContainer>
        </IntroductionDiv>
      </MobileView>
    </>
  );
}

export default MainIntroductionContent;
