import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

// 지금 사용안함
function MainRoomsCreate() {
  return (
    <div>
      <IconButton
        sx={{
          mx: 'auto',
          my: '10px',
          px: 2.5,
          borderRadius: '10px',
          background: '#97B2E1',
          height: '200px',
          width: '200px',
          '&:hover': {
            background: '#97B2E1' + '90',
          },
        }}>
        <AddIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            color: '#FFFFFF',
            height: '100px',
            width: '100px',
          }}
        />
      </IconButton>
    </div>
  );
}

export default MainRoomsCreate;
