import { styled } from '@mui/material';
import React from 'react';

interface RoomMainComponentContainerProps {
  children?: React.ReactNode;
  height?: string | number;
}

const CustomContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.component,
  color: theme.palette.txt,
  borderRadius: 10,
  padding: theme.spacing(1),
}));

function RoomMainComponentContainer({
  children,
  height = '100%',
}: RoomMainComponentContainerProps) {
  return <CustomContainer style={{ height: height }}>{children}</CustomContainer>;
}

export default RoomMainComponentContainer;
