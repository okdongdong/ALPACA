import { Container, Stack, styled, Grid } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import LogoWhite from '../../Assets/Img/Logo_White.png';
import React, { KeyboardEvent } from 'react';
import { useSelector } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import { useTheme } from '@mui/material/styles';
interface CContainerWithLogoProps {
  children: React.ReactNode;
  onKeyPress?: () => void;
}

const CustomContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  padding: theme.spacing(4, 8),
  textAlign: 'center',
}));

function CContainerWithLogo({ children, onKeyPress = () => {} }: CContainerWithLogoProps) {
  const theme = useTheme();
  const themeType = useSelector((state: any) => state.theme.themeType);

  // 폼 작성후 엔터키 눌렀을 때 함수 실행시켜줌
  const onKeyUpHandler = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      // 엔터키 눌렀을 때 실행시킬 함수
      onKeyPress();
    }
  };

  return (
    <>
      <BrowserView>
        <CustomContainer maxWidth="xs">
          <Stack spacing={6}>
            <div>
              {themeType === 'dark' ? (
                <img src={LogoWhite} alt="Logo" />
              ) : (
                <img src={Logo} alt="Logo" />
              )}
            </div>
            <Stack>
              <form
                onKeyUp={onKeyUpHandler}
                onSubmit={(event) => {
                  event.preventDefault();
                }}>
                {children}
              </form>
            </Stack>
          </Stack>
        </CustomContainer>
      </BrowserView>
      <MobileView>
        <Container
          sx={{
            backgroundColor: theme.palette.bg,
            textAlign: 'center',
            height: '94vh',
          }}>
          <div style={{ height: '20vh', paddingTop: '10vh' }}>
            {themeType === 'dark' ? (
              <img src={LogoWhite} alt="Logo" style={{ height: '6vh' }} />
            ) : (
              <img src={Logo} alt="Logo" style={{ height: '6vh' }} />
            )}
          </div>
          <Stack>
            <form
              onKeyUp={onKeyUpHandler}
              onSubmit={(event) => {
                event.preventDefault();
              }}>
              {children}
            </form>
          </Stack>
        </Container>
      </MobileView>
    </>
  );
}

export default CContainerWithLogo;
