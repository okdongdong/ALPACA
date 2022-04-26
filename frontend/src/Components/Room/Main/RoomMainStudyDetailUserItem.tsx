import { useNavigate } from 'react-router-dom';
import CBtn from '../../Commons/CBtn';
import CProfile from '../../Commons/CProfile';

export interface RoomMainStudyDetailUserItemProps {
  problemId: string;
  userId: string;
  nickname: string;
  profileImg: string;
}

function RoomMainStudyDetailUserItem({
  problemId,
  userId,
  nickname,
  profileImg,
}: RoomMainStudyDetailUserItemProps) {
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(`/codes/${problemId}/${userId}`);
  };

  return (
    <div>
      <CProfile nickname={nickname} profileImg={profileImg} />
      <CBtn content="코드" onClick={onClickHandler} />
    </div>
  );
}

export default RoomMainStudyDetailUserItem;
