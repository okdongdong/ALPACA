import { Remove } from '@mui/icons-material';
import { Divider, IconButton, Stack, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { customAxios } from '../../../Lib/customAxios';
import { setLoading } from '../../../Redux/commonReducer';
import { Member } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import CCrown from '../../Commons/CCrown';
import CProfile from '../../Commons/CProfile';
import RoomMainComponentContainer from './RoomMainComponentContainer';

interface RoomMainIntroductionMemberEditProps {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.warn,
  color: theme.palette.icon,
  width: 25,
  height: 25,
}));

function RoomMainIntroductionMemberEdit({ setIsEdit }: RoomMainIntroductionMemberEditProps) {
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  const userId = useSelector((state: any) => state.account.userId);
  const members = useSelector((state: any) => state.room.members);

  const [errorMessage, setErrorMessage] = useState<string>('');

  // 방장 권한 위임
  const empowerMember = async (memberId: number) => {
    dispatch(setLoading(true));
    try {
      const res = await customAxios({
        method: 'put',
        url: `study/member/${roomId}`,
        data: {
          memberId,
        },
      });
      dispatch(setLoading(false));
      if (res.status === 200) return true;
    } catch (e: any) {
      console.log('error: ', e.response);
      setErrorMessage(e.response.data.message);
    }
    dispatch(setLoading(false));
    return false;
  };

  // 멤버 추방
  const expulsionMember = async (memberId: number) => {
    dispatch(setLoading(true));
    try {
      const res = await customAxios({
        method: 'delete',
        url: `study/member/${roomId}`,
        data: {
          memberId,
        },
      });
      dispatch(setLoading(false));
      if (res.status === 200) return true;
    } catch (e: any) {
      console.log('error: ', e.response);
      setErrorMessage(e.response.data.message);
    }
    dispatch(setLoading(false));
    return false;
  };

  const onClickHandler = async (memberId: number) => {
    const result = await Swal.fire({
      title: '방장을 양도하시겠습니까?',
      text: '방장 권한을 양도합니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.main,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '양도',
      cancelButtonText: '취소',
      customClass: {
        // cancelButton: classes.customCancelButton,
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const res = await empowerMember(memberId);
      if (res) {
        setIsEdit(false);
        Swal.fire('양도 성공!', '방장 권한을 양도했습니다.', 'success');
      } else if (errorMessage) Swal.fire('양도 실패!', errorMessage, 'error');
    } else Swal.fire('양도 실패!', '잠시 후 다시 시도해주세요.', 'error');
  };

  const onDeleteHandler = async (memberId: number) => {
    const result = await Swal.fire({
      title: '멤버를 강퇴하시겠습니까?',
      text: '더 이상 함께할 수 없어요 ㅠㅠ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.warn,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '강퇴',
      cancelButtonText: '취소',
      customClass: {
        // cancelButton: classes.customCancelButton,
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const res = await expulsionMember(memberId);
      if (res) Swal.fire('강퇴 성공!', '멤버를 강퇴했습니다.', 'success');
      else if (errorMessage) Swal.fire('양도 실패!', errorMessage, 'error');
      else Swal.fire('강퇴 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  return (
    <RoomMainComponentContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>스터디원</h4>
        <div>
          <CBtn onClick={() => setIsEdit(false)}>완료</CBtn>
        </div>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <Stack spacing={1}>
        {members.map((member: Member, idx: number) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <CProfile nickname={member.nickname} profileImg={member.profileImg} />
            {!member.isRoomMaker && (
              <IconButton onClick={() => onClickHandler(member.userId)}>
                <CCrown width={20} height={20} color="#cdcdcd" />
              </IconButton>
            )}
            {userId !== member.userId && (
              <CustomIconButton onClick={() => onDeleteHandler(member.userId)}>
                <Remove />
              </CustomIconButton>
            )}
          </div>
        ))}
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainIntroductionMemberEdit;
