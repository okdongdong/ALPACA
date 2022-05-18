import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import CContainerWithLogo from '../../Components/Commons/CContainerWithLogo';
import CInput from '../../Components/Commons/CInput';
import { customAxios } from '../../Lib/customAxios';
import { setUserInfo } from '../../Redux/accountReducer';
import { setTheme } from '../../Redux/themeReducer';
import alpaca from '../../Assets/Img/alpaca.png';
import { isMobile } from 'react-device-detect';
import useAlert from '../../Hooks/useAlert';

function Login(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const cAlert = useAlert();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // 로그인요청
  const login = async () => {
    cAlert.fire({
      title: '로그인 시도',
      html: `<span>로그인 시도중입니다..</span>`,
      icon: undefined,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        cAlert.showLoading();
      },
    });

    const userInfo = {
      username,
      password,
    };

    const span = cAlert.getHtmlContainer()?.querySelector('span');
    setTimeout(() => {
      if (span) span.textContent = '데이터를 가져오는 중입니다..';
    }, 1500);
    setTimeout(() => {
      if (span) span.textContent = '풀이한 문제가 많을경우 시간이 오래걸릴 수 있습니다.';
    }, 5000);
    setTimeout(() => {
      if (span) span.textContent = '잠시만 기다려주세요..';
    }, 8500);
    try {
      const res = await customAxios({ method: 'post', url: `/auth/login`, data: userInfo });
      console.log('loginRes: ', res);

      // 토큰 저장
      localStorage.setItem('accessToken', res.data.grantType + res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.grantType + res.data.refreshToken);

      // 필요한 정보만 취합
      const resUserInfo = {
        userId: res.data.userId,
        username: res.data.username,
        nickname: res.data.nickname,
        info: res.data.info,
        profileImg: !!res.data.profileImg ? res.data.profileImg : alpaca,
        bojId: res.data.bojId,
        preferredLanguage: res.data.preferredLanguage,
        studies: res.data.studies,
        isLogin: true,
        studyCount: res.data.studyCount,
      };

      console.log(resUserInfo);

      await cAlert.fire({
        title: '로그인 성공!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
      });
      clearTimeout();

      // 메인페이지로 이동
      if (!!location.state && typeof location.state === 'string') {
        navigate(location.state);
      } else {
        // 정보 store에 저장
        navigate('/');
      }
      dispatch(setUserInfo(resUserInfo));
      dispatch(setTheme(res.data.theme));
      // 알림창 닫기
    } catch (e: any) {
      clearTimeout();
      setTimeout(() => {
        cAlert.fire({
          title: '로그인 실패!',
          text: e.response.data.message || '잠시 후 다시 시도해주세요.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }, 1000);

      console.log('loginError:', e.response);
    }
  };

  // 엔터키 눌렀을 때 => 엔터키 인식부분은 CContainerWithLogo에 선언되어있음
  const onkeyPressHandler = () => {
    if (!!username && !!password) {
      login();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <CContainerWithLogo onKeyPress={onkeyPressHandler}>
      <CInput onChange={setUsername} label="ID" />
      <div style={{ height: isMobile ? '6vh' : 0 }}></div>
      <CInput type="password" onChange={setPassword} label="PASSWORD" />
      <div
        style={{
          width: '100%',
          justifyContent: isMobile ? 'space-between' : 'space-around',
          display: 'flex',
          marginTop: isMobile ? '10vh' : 0,
        }}>
        <CBtn width="30%" content="회원가입" onClick={() => navigate('/signup')} />
        <CBtn
          width="30%"
          content="로그인"
          onClick={login}
          disabled={username === '' || password === ''}
        />
      </div>
    </CContainerWithLogo>
  );
}

export default Login;
