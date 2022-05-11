import { Divider, Stack, styled } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainIntroductionMemberEdit from './RoomMainIntroductionMemberEdit';
import RoomMainIntroductionMemberList from './RoomMainIntroductionMemberList';

const IntroductionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
}));

function RoomMainIntroduction() {
  const info = useSelector((state: any) => state.room.info);

  // 스터디원 관리
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <IntroductionContainer spacing={3}>
      <RoomMainComponentContainer>
        <h4>소개글</h4>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
        <p>{info}</p>
      </RoomMainComponentContainer>

      {isEdit ? (
        <RoomMainIntroductionMemberEdit setIsEdit={setIsEdit} />
      ) : (
        <RoomMainIntroductionMemberList setIsEdit={setIsEdit} />
      )}
    </IntroductionContainer>
  );
}

export default RoomMainIntroduction;
