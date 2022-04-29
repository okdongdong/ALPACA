import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import CContainerWithLogo from '../../Components/Commons/CContainerWithLogo';
import CInput from '../../Components/Commons/CInput';
import { customAxios } from '../../Lib/customAxios';
import { setUserInfo } from '../../Redux/accountReducer';
import { setLoading } from '../../Redux/commonReducer';
import { setTheme } from '../../Redux/themeReducer';
import alpaca from '../../Assets/Img/alpaca.png';

function Login(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // 로그인요청
  const login = async () => {
    dispatch(setLoading(true));

    const userInfo = {
      username,
      password,
    };

    try {
      const res = await customAxios({ method: 'post', url: `/auth/login`, data: userInfo });

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
      };

      console.log(resUserInfo);

      // 정보 store에 저장
      dispatch(setUserInfo(resUserInfo));
      dispatch(setTheme(res.data.theme));

      // 메인페이지로 이동
      console.log(location.state);

      if (!!location.state && typeof location.state === 'string') {
        navigate(location.state);
      } else {
        navigate('/');
      }
    } catch (e: any) {
      console.log(e);
    }

    dispatch(setLoading(false));
  };

  // 엔터키 눌렀을 때 => 엔터키 인식부분은 CContainerWithLogo에 선언되어있음
  const onkeyPressHandler = () => {
    if (!!username && !!password) {
      login();
    }
  };

  return (
    <CContainerWithLogo onKeyPress={onkeyPressHandler}>
      <CInput onChange={setUsername} label="ID" />
      <CInput type="password" onChange={setPassword} label="PASSWORD" />
      <div style={{ width: '100%', justifyContent: 'space-around', display: 'flex' }}>
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
