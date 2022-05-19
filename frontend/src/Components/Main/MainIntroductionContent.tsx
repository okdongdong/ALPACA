import { useSelector } from 'react-redux';
import { Divider, Input, Stack } from '@mui/material';
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
  '&:before': { borderBottom: `0px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const IntroductionDiv = styled(Stack)({ width: '100%', paddingRight: '16px' });

function MainIntroductionContent() {
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  return (
    <>
      <BrowserView style={{ width: '100%' }}>
        <Stack spacing={2}>
          <CustomContainer>
            <h4>닉네임</h4>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <p>{userInfo.nickname}</p>
          </CustomContainer>
          <CustomContainer>
            <h4>Boj ID</h4>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <p>{userInfo.bojId}</p>
          </CustomContainer>
          <CustomContainer>
            <h4>자기소개</h4>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <p>{userInfo.info}</p>
          </CustomContainer>
        </Stack>
      </BrowserView>
      <MobileView style={{ width: '100%' }}>
        <IntroductionDiv>
          <div style={{ marginTop: '1vh' }}>
            <Clabel htmlFor="">닉네임</Clabel>
          </div>
          <CustomContainer sx={{ marginBottom: '1vh' }}>
            <TInput sx={{ width: '100%' }} value={userInfo.nickname}></TInput>
          </CustomContainer>
          <div style={{ marginTop: '1vh' }}>
            <Clabel htmlFor="">Boj ID</Clabel>
          </div>
          <CustomContainer sx={{ marginBottom: '1vh' }}>
            <TInput sx={{ width: '100%' }} value={userInfo.bojId}></TInput>
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
