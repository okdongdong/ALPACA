import { Settings } from '@mui/icons-material';
import { Divider, Stack, styled } from '@mui/material';
import { useState } from 'react';
import { Member } from '../../../Pages/Room/RoomMain';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainIntroductionMemberEdit from './RoomMainIntroductionMemberEdit';
import RoomMainIntroductionMemberList from './RoomMainIntroductionMemberList';

interface RoomMainIntroductionProps {
  info: string;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

const IntroductionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
}));

function RoomMainIntroduction({ info, members, setMembers }: RoomMainIntroductionProps) {
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
        <RoomMainIntroductionMemberEdit
          members={members}
          setIsEdit={setIsEdit}
          setMembers={setMembers}
        />
      ) : (
        <RoomMainIntroductionMemberList members={members} setIsEdit={setIsEdit} />
      )}
    </IntroductionContainer>
  );
}

export default RoomMainIntroduction;
