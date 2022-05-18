import { customAxios } from '../Lib/customAxios';
import useAlert from './useAlert';
import useLogout from './useLogout';

function useReissue() {
  const cAlert = useAlert();
  const logout = useLogout();

  // 저장된 토큰을 다시 불러옴
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const token = localStorage.getItem('accessToken') || '';

  const requestReissue = async () => {
    // 토큰 refresh요청
    try {
      const res = await customAxios({
        method: 'post',
        url: `/auth/reissue`,
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      });

      // localStorage 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // 토큰 재설정
      const grantType = res.data.grantType;
      const newAccessToken = grantType + res.data.accessToken;
      const newRefreshToken = grantType + res.data.refreshToken;

      // localStorage 설정
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      //실패했던 요청 재요청
    } catch (e: any) {
      await cAlert.fire({
        title: '토큰 만료!',
        text: '토큰이 만료되어 로그아웃됩니다.',
        icon: 'info',
        showConfirmButton: false,
        timer: 1500,
      });
      logout();
    }
  };
  return requestReissue;
}

export default useReissue;
