import React from 'react';
import TextField from '@mui/material/TextField';
import theme from '../../Lib/theme';

function MainIntroductionContent() {
  const [nickname, setNickname] = React.useState('ssafy');
  const [introduction, setIntroduction] = React.useState('hello');

  return (
    <div>
      <div>
        <label htmlFor="">닉네임</label>
      </div>
      <TextField
        id="filled-read-only-input"
        multiline
        maxRows={4}
        value={nickname}
        sx={{
          width: 500,
          background: '#F2F2F2',
        }}
      />
      <div>
        <label htmlFor="">자기소개</label>
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
