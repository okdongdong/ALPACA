import { Container, Stack, styled } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import React from 'react';

interface CContainerWithLogoProps {
  children: React.ReactNode;
}

const CustomContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#eee',
  padding: theme.spacing(4, 8),
}));

function CContainerWithLogo({ children }: CContainerWithLogoProps) {
  return (
    <CustomContainer maxWidth="xs">
      <Stack spacing={6}>
        <div>
          <img src={Logo} alt="Logo" />
        </div>
        <Stack sx={{ width: '100%' }}>{children}</Stack>
      </Stack>
    </CustomContainer>
  );
}

export default CContainerWithLogo;
