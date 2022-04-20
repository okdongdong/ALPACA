import { Container, Stack, styled } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import React from 'react';

interface CContainerWithLogoProps {
  children: React.ReactNode;
}

const CustomContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  padding: theme.spacing(4, 8),
  textAlign: 'center',
}));

function CContainerWithLogo({ children }: CContainerWithLogoProps) {
  return (
    <CustomContainer maxWidth="xs">
      <Stack spacing={6}>
        <div>
          <img src={Logo} alt="Logo" />
        </div>
        <Stack>{children}</Stack>
      </Stack>
    </CustomContainer>
  );
}

export default CContainerWithLogo;
