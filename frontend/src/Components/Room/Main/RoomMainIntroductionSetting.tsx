import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useAlert from '../../../Hooks/useAlert';
import { customAxios } from '../../../Lib/customAxios';
import { setRoomIntroduction } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import CInput from '../../Commons/CInput';

function RoomMainIntroductionSetting() {
  const { roomId } = useParams();
  const cAlert = useAlert();
  const dispatch = useDispatch();

  const roomTitle = useSelector((state: any) => state.room.title);
  const roomInfo = useSelector((state: any) => state.room.info);
  const isRoomMaker = useSelector((state: any) => state.room.isRoomMaker);

  const [title, setTitle] = useState<string>(roomTitle);
  const [info, setInfo] = useState<string>(roomInfo);
  const [titleMessage, setTitleMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const titleRegex = /^.{0,50}$/;
  const infoRegex = /^.{0,500}$/;

  const onEditHandler = async () => {
    try {
      // eslint-disable-next-line no-throw-literal
      if (!title) throw { message: '스터디 이름을 입력하세요.' };

      const res = await customAxios({
        method: 'put',
        url: `/study/${roomId}`,
        data: { title, info },
      });
      console.log('Edit: ', res);
      dispatch(setRoomIntroduction({ title, info }));
      cAlert.fire({
        title: '수정 성공!',
        text: '스터디 정보를 변경했어요.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (e: any) {
      cAlert.fire({
        title: '수정 실패!',
        text: e.message || e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    if (titleRegex.test(title)) {
      setTitleMessage('');
    } else {
      setTitleMessage('50자 이하로 입력하세요.');
    }
  }, [title]);

  useEffect(() => {
    if (infoRegex.test(info)) {
      setInfoMessage('');
    } else {
      setInfoMessage('500자 이하로 입력하세요.');
    }
  }, [info]);

  useEffect(() => {
    setTitle(roomTitle);
    setInfo(roomInfo);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>스터디 정보 {isRoomMaker && ' 관리'}</h3>
        <CBtn width="20%" height="100%" onClick={onEditHandler} disabled={!isRoomMaker}>
          수정
        </CBtn>
      </div>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <div style={{ width: '80%' }}>
        <CInput
          label="스터디 이름"
          onChange={setTitle}
          multiline={true}
          value={title}
          placeholder="스터디 이름을 입력하세요."
          helperText={titleMessage}
          readOnly={!isRoomMaker}
        />
        <CInput
          label="스터디 소개"
          onChange={setInfo}
          multiline={true}
          value={info}
          placeholder="스터디 소개를 입력하세요."
          helperText={infoMessage}
          readOnly={!isRoomMaker}
        />
      </div>
    </div>
  );
}

export default RoomMainIntroductionSetting;
