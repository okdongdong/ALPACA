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
        <Stack spacing={2}>
          <CustomContainer>
            <h4>닉네임</h4>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <p>{userInfo.nickname}</p>
          </CustomContainer>
          <CustomContainer>
            <h4>자기소개</h4>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <p>{userInfo.info}</p>
          </CustomContainer>
        </Stack>
      </BrowserView>
      <MobileView>
        <IntroductionDiv sx={{ marginRight: '10px' }}>
          <div style={{ marginTop: '1vh' }}>
            <Clabel htmlFor="">닉네임</Clabel>
          </div>
          <CustomContainer sx={{ marginBottom: '1vh' }}>
            <TInput sx={{ width: '100%' }} value={userInfo.nickname}></TInput>
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
