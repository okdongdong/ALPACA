import { Button } from '@mui/material';
import React from 'react';

interface CBtnProps {
  content: string;
  color?: string;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  onClick: () => void;
}

function CBtn({
  content,
  color = '#97B2E1',
  disabled = false,
  width = '100%',
  height = '100%',
  onClick,
}: CBtnProps) {
  return (
    <Button
      sx={{
        backgroundColor: color,
        borderRadius: '10px',
        color: '#000',
        width: width,
        height: height,
      }}
      disabled={disabled}
      onClick={onClick}>
      {content}
    </Button>
  );
}

export default CBtn;
