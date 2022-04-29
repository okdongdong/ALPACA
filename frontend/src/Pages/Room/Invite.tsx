import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import CContainerWithLogo from '../../Components/Commons/CContainerWithLogo';
import { customAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';

interface InviteInfo {
  managerName: string;
  managerProfile: string;
  studyTitle: string;
  studyId: number;
}

function Invite() {
  const { inviteCode } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector((state: any) => state.account.isLogin);

  const [inviteInfo, setInviteInfo] = useState<InviteInfo>({
    managerName: '',
    managerProfile: '',
    studyTitle: '',
    studyId: 0,
  });

  const getInviteInfo = async () => {
    dispatch(setLoading(true));

    try {
      const res = customAxios({ method: 'get', url: '', params: { inviteCode } });

      console.log(res);
    } catch (e) {
      console.log(e);
    }

    dispatch(setLoading(false));
  };

  const acceptInvite = async () => {
    dispatch(setLoading(true));

    try {
      const res = customAxios({ method: 'post', url: '', data: { studyId: inviteInfo.studyId } });

      console.log(res);
    } catch (e) {
      console.log(e);
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
          <img src={inviteInfo.managerProfile} alt="profileImg" />
        </div>
        <div>
          {inviteInfo.managerName}님이 당신을 {inviteInfo.studyTitle}로 초대했습니다.
        </div>
        <div>수락하시겠습니까?</div>
        <div style={{ justifyContent: 'center', display: 'flex' }}>
          {isLogin ? (
            <Stack>
              <CBtn height="100%" onClick={() => navigate('/login', { state: pathname })}>
                로그인
              </CBtn>
              <div>* 로그인 후 수락페이지로 다시 이동합니다.</div>
            </Stack>
          ) : (
            <Stack direction="row" spacing={5}>
              <CBtn height="100%" onClick={() => {}}>
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
