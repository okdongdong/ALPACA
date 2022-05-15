import { Divider, Stack, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainIntroductionMemberList from './RoomMainIntroductionMemberList';

function RoomMainIntroduction() {
  const info = useSelector((state: any) => state.room.info);

  // 스터디원 관리

  return (
    <>
      <RoomMainComponentContainer height="fit-content">
        <h4>소개글</h4>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
        <p>{info}</p>
      </RoomMainComponentContainer>
      <RoomMainIntroductionMemberList />
    </>
  );
}

export default RoomMainIntroduction;
