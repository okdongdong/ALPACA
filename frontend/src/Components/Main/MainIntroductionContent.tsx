import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
}));

function MainIntroductionContent(props: any) {
  const [nickName, setNickName] = React.useState('ssafy');
  const [introduction, setIntroduction] = React.useState('hello');

  return (
    <div>
      <div>
        <Clabel htmlFor="">닉네임</Clabel>
      </div>
      <TextField
        id="filled-read-only-input"
        multiline
        maxRows={4}
        value={nickName}
        sx={{
          width: 500,
          background: '#F2F2F2',
        }}
      />
      <div>
        <Clabel htmlFor="">자기소개</Clabel>
      </div>
      <TextField
        id="filled-read-only-input"
        multiline
        maxRows={4}
        value={introduction}
        sx={{
          width: 500,
          background: '#F2F2F2',
        }}
      />
    </div>
  );
}

export default MainIntroductionContent;
