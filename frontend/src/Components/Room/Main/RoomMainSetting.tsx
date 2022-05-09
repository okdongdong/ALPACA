import { Collapse, Stack, styled, Switch, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { customAxios } from '../../../Lib/customAxios';
import { setLoading } from '../../../Redux/commonReducer';
import CBtn from '../../Commons/CBtn';
import RoomMainComponentContainer from './RoomMainComponentContainer';

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  color: theme.palette.txt,
}));

function RoomMainSetting() {
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSetting = useSelector((state: any) => state.room.isSetting);

  const [alarmOn, setAlarmOn] = useState<boolean>(true);

  const onAlarmClickHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlarmOn(event.target.checked);
  };

  const deleteStudy = async () => {
    dispatch(setLoading(true));
    try {
      const res = await customAxios({ method: 'delete', url: `/study/${roomId}` });
      dispatch(setLoading(false));
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
      if (res.status === 200) return true;
    } catch (e: any) {
      console.log('error: ', e.response);
    }
    dispatch(setLoading(false));
    return false;
  };

  const deleteHandler = async () => {
    const result = await Swal.fire({
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
      if (res) Swal.fire('삭제 성공!', '스터디를 삭제했습니다.', 'success');
      else Swal.fire('삭제 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  const leaveHandler = async () => {
    const result = await Swal.fire({
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
      if (res) Swal.fire('탈퇴 성공!', '스터디에서 탈퇴했습니다.', 'success');
      else Swal.fire('탈퇴 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  return (
    <Collapse in={isSetting} sx={{ position: 'fixed', left: 150, bottom: 50 }}>
      <div style={{ width: 200, height: 200 }}>
        <RoomMainComponentContainer>
          <CustomBox spacing={2} sx={{ padding: 1 }}>
            <div>
              <CBtn
                onClick={() => {
                  setAlarmOn((prev) => !prev);
                }}>
                알림설정
              </CBtn>
              <Switch checked={alarmOn} onChange={onAlarmClickHandler} />
            </div>
            <CBtn
              backgroundColor={theme.palette.warn}
              onClick={() => {
                deleteHandler();
              }}>
              스터디 삭제
            </CBtn>
            <CBtn
              backgroundColor={theme.palette.warn}
              onClick={() => {
                leaveHandler();
              }}>
              스터디 탈퇴
            </CBtn>
          </CustomBox>
        </RoomMainComponentContainer>
      </div>
    </Collapse>
  );
}

export default RoomMainSetting;
