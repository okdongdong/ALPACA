import { Settings } from '@mui/icons-material';
import { Divider, IconButton, Stack, styled } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Member } from '../../../Redux/roomReducer';
import CCrown from '../../Commons/CCrown';
import CProfile from '../../Commons/CProfile';
import RoomMainComponentContainer from './RoomMainComponentContainer';


const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.icon,
}));

function RoomMainIntroductionMemberList() {
  const members = useSelector((state: any) => state.room.members);
  const userId = useSelector((state: any) => state.account.userId);

  return (
    <RoomMainComponentContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>스터디원</h4>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <Stack spacing={1}>
        {members.map((member: Member, idx: number) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <CProfile nickname={member.nickname} profileImg={member.profileImg} />
            {member.roomMaker && (
              <div>
                <CCrown width={25} height={25} color="#FFCD29" />
              </div>
            )}
          </div>
        ))}
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainIntroductionMemberList;
