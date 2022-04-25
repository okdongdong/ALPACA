import { Settings } from '@mui/icons-material';
import { Divider, IconButton, Stack, styled } from '@mui/material';
import CProfile from '../../Commons/CProfile';
import RoomMainComponentContainer from './RoomMainComponentContainer';

interface RoomMainIntroductionProps {
  info: string;
  members: { nickname: string; profileImg: string }[];
}

const IntroductionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.icon,
}));

function RoomMainIntroduction({ info, members }: RoomMainIntroductionProps) {
  return (
    <IntroductionContainer spacing={3}>
      <RoomMainComponentContainer>
        <h4>소개글</h4>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
        <p>{info}</p>
      </RoomMainComponentContainer>

      <RoomMainComponentContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>스터디원</h4>
          <CustomIconButton size="small">
            <Settings />
          </CustomIconButton>
        </div>
        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
        {members.map((member, idx) => (
          <CProfile key={idx} nickname={member.nickname} profileImg={member.profileImg} />
        ))}
      </RoomMainComponentContainer>
    </IntroductionContainer>
  );
}

export default RoomMainIntroduction;
