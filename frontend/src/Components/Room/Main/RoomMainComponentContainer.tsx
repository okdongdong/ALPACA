import { styled } from '@mui/material';
import React from 'react';

interface RoomMainComponentContainerProps {
  children?: React.ReactNode;
}

const CustomContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.component,
  color: theme.palette.txt,
  borderRadius: 10,
  padding: theme.spacing(1),
}));

function RoomMainComponentContainer({ children }: RoomMainComponentContainerProps) {
  return <CustomContainer>{children}</CustomContainer>;
}

export default RoomMainComponentContainer;
