import { useNavigate, useParams } from 'react-router-dom';
import CBtn from '../../Commons/CBtn';
import CProfile from '../../Commons/CProfile';

export interface RoomMainStudyDetailUserItemProps {
  problemId: number;
  userId: number;
  nickname: string;
  profileImg: string;
  backgroundColor?: string;
}

function RoomMainStudyDetailUserItem({
  problemId,
  userId,
  nickname,
  profileImg,
  backgroundColor,
}: RoomMainStudyDetailUserItemProps) {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`/codes/${problemId}/${userId}`, { state: roomId });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingRight: '8px',
        alignItems: 'center',
        backgroundColor: backgroundColor,
      }}>
      <CProfile nickname={nickname} profileImg={profileImg} />
      <CBtn content="코드" onClick={onClickHandler} />
    </div>
  );
}

export default RoomMainStudyDetailUserItem;
