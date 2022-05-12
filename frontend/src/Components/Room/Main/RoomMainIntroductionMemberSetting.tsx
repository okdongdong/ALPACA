import { Remove } from '@mui/icons-material';
import { Divider, IconButton, Stack, styled } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useAlert from '../../../Hooks/useAlert';
import { customAxios } from '../../../Lib/customAxios';
import { setLoading } from '../../../Redux/commonReducer';
import { Member } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import CCrown from '../../Commons/CCrown';
import CProfile from '../../Commons/CProfile';

interface RoomMainIntroductionMemberSettingProps {
  setInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.warn,
  color: theme.palette.icon,
  width: 25,
  height: 25,
}));

function RoomMainIntroductionMemberSetting({
  setInviteOpen,
}: RoomMainIntroductionMemberSettingProps) {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const cAlert = useAlert();
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
    const result = await cAlert.fire({
      title: '방장을 양도하시겠습니까?',
      text: '방장 권한을 양도합니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '양도',
      cancelButtonText: '취소',
      color: 'rgb(255,0,0)',
    });

    if (result.isConfirmed) {
      const res = await empowerMember(memberId);
      if (res) {
        cAlert.fire({
          title: '양도 성공!',
          text: '방장 권한을 양도했습니다.',
          icon: 'success',
          confirmButtonText: '닫기',
        });
      } else if (!!errorMessage)
        cAlert.fire('양도 실패!', errorMessage, 'error').then(() => {
          setErrorMessage('');
        });
      else cAlert.fire('양도 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  const onDeleteHandler = async (memberId: number) => {
    const result = await cAlert.fire({
      title: '멤버를 강퇴하시겠습니까?',
      text: '더 이상 함께할 수 없어요 ㅠㅠ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '강퇴',
      cancelButtonText: '취소',
      customClass: {
        // cancelButton: classes.customCancelButton,
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const res = await expulsionMember(memberId);
      if (res) cAlert.fire('강퇴 성공!', '멤버를 강퇴했습니다.', 'success');
      else if (!!errorMessage)
        cAlert.fire('양도 실패!', errorMessage, 'error').then(() => {
          setErrorMessage('');
        });
      else cAlert.fire('강퇴 실패!', '잠시 후 다시 시도해주세요.', 'error');
    }
  };

  return (
    <div>
      {members.some((member: Member) => member.userId === userId && member.roomMaker) && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>스터디 멤버 관리</h3>
            <CBtn
              width="20%"
              height="100%"
              onClick={() => {
                setInviteOpen(true);
              }}>
              초대
            </CBtn>
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
                <div>
                  {!member.roomMaker && (
                    <>
                      <IconButton onClick={() => onClickHandler(member.userId)}>
                        <CCrown width={20} height={20} color="#cdcdcd" />
                      </IconButton>
                      {userId !== member.userId && (
                        <CustomIconButton onClick={() => onDeleteHandler(member.userId)}>
                          <Remove />
                        </CustomIconButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </Stack>
        </>
      )}
    </div>
  );
}

export default RoomMainIntroductionMemberSetting;
