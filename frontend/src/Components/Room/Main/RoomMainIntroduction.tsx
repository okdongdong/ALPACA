import { Divider, Stack, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainIntroductionMemberList from './RoomMainIntroductionMemberList';

const IntroductionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
}));

function RoomMainIntroduction() {
  const info = useSelector((state: any) => state.room.info);

  // 스터디원 관리

  return (
    <IntroductionContainer spacing={3}>
      <RoomMainComponentContainer>
        <h4>소개글</h4>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
        <p>{info}</p>
      </RoomMainComponentContainer>
      <RoomMainIntroductionMemberList />
    </IntroductionContainer>
  );
}

export default RoomMainIntroduction;
