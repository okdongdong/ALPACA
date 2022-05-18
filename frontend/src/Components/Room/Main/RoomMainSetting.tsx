import { Stack, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useAlert from '../../../Hooks/useAlert';
import { customAxios } from '../../../Lib/customAxios';
import { deleteStudyUserInfo } from '../../../Redux/accountReducer';
import { setLoading } from '../../../Redux/commonReducer';
import { Member } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';

interface RoomMainSettingProps {
  data: Function;
}

function RoomMainSetting(props: RoomMainSettingProps) {
  const { roomId } = useParams();
  const theme = useTheme();
  const cAlert = useAlert();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state: any) => state.account.userId);
  const members = useSelector((state: any) => state.room.members);
  const isRoomMaker = useSelector((state: any) => state.room.isRoomMaker);

  const deleteStudy = async () => {
    dispatch(setLoading(true));
    try {
      const res = await customAxios({ method: 'delete', url: `/study/${roomId}` });
      dispatch(setLoading(false));
      dispatch(deleteStudyUserInfo(roomId));
      if (res.status === 200) return true;
    } catch (e: any) {
      console.log('error: ', e.response);
    }

    dispatch(setLoading(false));
    return false;
  };

  const leaveStudy = async () => {
    dispatch(setLoading(true));
    try {
      const res = await customAxios({ method: 'delete', url: `/study/exit/${roomId}` });
      dispatch(setLoading(false));
      dispatch(deleteStudyUserInfo(roomId));
      if (res.status === 200) return true;
    } catch (e: any) {
      console.log('error: ', e.response);
    }
    dispatch(setLoading(false));
    return false;
  };

  const deleteHandler = async () => {
    const result = await cAlert.fire({
      title: '스터디 삭제하시겠습니까?',
      text: '스터디가 영구적으로 삭제됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.warn,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      customClass: {
        // cancelButton: classes.customCancelButton,
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const res = await deleteStudy();
      if (res)
        cAlert.fire('삭제 성공!', '스터디를 삭제했습니다.', 'success').then(() => {
          props.data();
          navigate('/');
        });
      else cAlert.fire('삭제 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  const leaveHandler = async () => {
    const result = await cAlert.fire({
      title: '스터디를 탈퇴하시겠습니까?',
      text: '스터디를 떠납니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.warn,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소',
      customClass: {
        // cancelButton: classes.customCancelButton,
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const res = await leaveStudy();
      if (res)
        cAlert.fire('탈퇴 성공!', '스터디에서 탈퇴했습니다.', 'success').then(() => {
          props.data();
          navigate('/');
        });
      else cAlert.fire('탈퇴 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 'bold' }}>스터디 설정</div>
      {isRoomMaker ? (
        <CBtn
          color="#fff"
          backgroundColor={theme.palette.warn}
          onClick={() => {
            deleteHandler();
          }}>
          스터디 삭제
        </CBtn>
      ) : (
        <CBtn
          color="#fff"
          backgroundColor={theme.palette.warn}
          onClick={() => {
            leaveHandler();
          }}>
          스터디 탈퇴
        </CBtn>
      )}
    </div>
  );
}

export default RoomMainSetting;
