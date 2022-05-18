import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import CContainerWithLogo from '../../Components/Commons/CContainerWithLogo';
import { customAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';
import alpaca from '../../Assets/Img/alpaca.png';

interface InviteInfo {
  roomMaker: string;
  roomMakerProfileImg: string;
  title: string;
  info: string;
  studyId: number;
}

function Invite() {
  const { inviteCode } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector((state: any) => state.account.isLogin);

  const [inviteInfo, setInviteInfo] = useState<InviteInfo>({
    roomMaker: '',
    roomMakerProfileImg: '',
    title: '',
    studyId: 0,
    info: '',
  });

  const getInviteInfo = async () => {
    dispatch(setLoading(true));

    try {
      const res = await customAxios({
        method: 'get',
        url: '/study/inviteInfo',
        params: { inviteCode },
      });
      setInviteInfo(res.data);
      console.log(res);
    } catch (e: any) {
      console.log(e.response);
    }

    dispatch(setLoading(false));
  };

  const acceptInvite = async () => {
    dispatch(setLoading(true));

    try {
      const res = await customAxios({
        method: 'post',
        url: '/study/inviteCode',
        data: { inviteCode },
      });
      navigate('/');
      console.log(res);
    } catch (e: any) {
      console.log(e.response);
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    console.log(pathname);
    getInviteInfo();
  }, []);

  return (
    <CContainerWithLogo>
      <Stack spacing={3}>
        <div>
          <img src={inviteInfo.roomMakerProfileImg || alpaca} alt="profileImg" />
        </div>
        <div>
          {inviteInfo.roomMaker}님이 당신을 {inviteInfo.title}로 초대했습니다.
        </div>
        <div>수락하시겠습니까?</div>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {!isLogin ? (
            <Stack>
              <CBtn height="100%" onClick={() => navigate('/login', { state: pathname })}>
                로그인
              </CBtn>
              <div>* 로그인 후 수락페이지로 다시 이동합니다.</div>
            </Stack>
          ) : (
            <Stack direction="row" spacing={5}>
              <CBtn height="100%" onClick={() => navigate('/')}>
                거절
              </CBtn>
              <CBtn height="100%" onClick={acceptInvite}>
                수락
              </CBtn>
            </Stack>
          )}
        </div>
      </Stack>
    </CContainerWithLogo>
  );
}

export default Invite;
