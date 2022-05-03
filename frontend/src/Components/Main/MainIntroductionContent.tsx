import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
}));

function MainIntroductionContent() {
  const userInfo = useSelector((state: any) => state.account);
  return (
    <div>
      <div>
        <Clabel htmlFor="">닉네임</Clabel>
      </div>
      <TextField
        id="filled-read-only-input"
        multiline
        maxRows={4}
        value={userInfo.nickname}
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
        value={userInfo.info}
        sx={{
          width: 500,
          background: '#F2F2F2',
        }}
      />
    </div>
  );
}

export default MainIntroductionContent;
