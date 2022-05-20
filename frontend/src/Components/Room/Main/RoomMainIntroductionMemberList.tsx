import { Divider, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Member } from '../../../Redux/roomReducer';
import CCrown from '../../Commons/CCrown';
import CProfile from '../../Commons/CProfile';
import RoomMainComponentContainer from './RoomMainComponentContainer';

function RoomMainIntroductionMemberList() {
  const members = useSelector((state: any) => state.room.members);

  return (
    <RoomMainComponentContainer height="fit-content" marginBottom={0}>
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
