import { useDispatch } from 'react-redux';
import { customAxios } from '../Lib/customAxios';
import { logout } from '../Redux/accountReducer';
import useAlert from './useAlert';

function useLogout() {
  const dispatch = useDispatch();
  const cAlert = useAlert();

  const clickLogout = async () => {
    try {
      await customAxios({
        method: 'post',
        url: '/auth/logout',
        headers: { RefreshToken: localStorage.getItem('refreshToken') || '' },
      });
      dispatch(logout());
    } catch (e: any) {
      dispatch(logout());
      // cAlert.fire({
      //   title: '로그아웃 실패!',
      //   text: e.response.data.message || '잠시 후 다시 시도해주세요.',
      //   icon: 'error',
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
    }
  };

  return clickLogout;
}

export default useLogout;
