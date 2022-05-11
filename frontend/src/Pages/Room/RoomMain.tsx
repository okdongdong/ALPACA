import { Box, Grid, Stack, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import MemberInvite from '../../Components/Dialogs/MemberInvite';
import RoomMainCalendar from '../../Components/Room/Main/RoomMainCalendar';
import RoomMainChat from '../../Components/Room/Main/RoomMainChat';
import RoomMainIntroduction from '../../Components/Room/Main/RoomMainIntroduction';
import RoomMainSetting from '../../Components/Room/Main/RoomMainSetting';
import RoomMainStudyCreate from '../../Components/Room/Main/RoomMainStudyCreate';
import RoomMainStudyDetail from '../../Components/Room/Main/RoomMainStudyDetail';
import RoomStudyLivePreview from '../../Components/Room/StudyLive/RoomStudyLivePreview';
import { customAxios } from '../../Lib/customAxios';
import {
  setRoomInfo,
  setMemberDict,
  setSchedules,
  setSelectedDayIdx,
  setIsStudyExist,
  setIsEdit,
  setProblemListRes,
  Schedule,
  Member,
  MemberDict,
  resetRoomInfo,
  setScheduleId,
} from '../../Redux/roomReducer';

const RoomTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'left',
  paddingBottom: theme.spacing(3),
}));

function RoomMain() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const title = useSelector((state: any) => state.room.title);
  const dateRange = useSelector((state: any) => state.room.dateRange);
  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const isStudyExist = useSelector((state: any) => state.room.isStudyExist);
  const isEdit = useSelector((state: any) => state.room.isEdit);

  // 초대 dialog open
  const [open, setOpen] = useState<boolean>(false);

  // preview dialog open
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // 스터디룸 정보조회
  const getRoomInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}`,
      });

      console.log('roomInfo: ', res);
      dispatch(setRoomInfo(res.data));

      // 문자열로 받아진 스케줄 Date로 변환
      const tempSchedules: Schedule[] = [];
      res.data.scheduleListRes.forEach((schedule: Schedule) => {
        const startedAt = new Date(schedule.startedAt);
        const finishedAt = new Date(schedule.finishedAt);
        tempSchedules.push({ id: schedule.id, startedAt, finishedAt });
      });
      dispatch(setSchedules(tempSchedules));

      // 유저정보 dict형태{id:info}로 저장
      const tempDict: MemberDict = {};
      res.data.members.forEach((member: Member) => {
        tempDict[member.userId] = { nickname: member.nickname, profileImg: member.profileImg };
      });
      dispatch(setMemberDict(tempDict));
      console.log('userDict:', tempDict);
    } catch (e) {}
  };

  // 페이지 랜더링시 스터디 기본정보를 가져옴
  useEffect(() => {
    getRoomInfo();
  }, []);

  // 현재 선택한 날짜에 스터디가 존재하는지 확인
  useEffect(() => {
    if (dateRange.length > 0) {
      const DAY_TO_MILLISEC = 24 * 60 * 60 * 1000;
      const timeDiff = selectedDay.getTime() - dateRange[0].day.getTime();
      const dateDiff = Math.ceil(timeDiff / DAY_TO_MILLISEC);
      dispatch(setSelectedDayIdx(dateDiff));
      dispatch(setIsStudyExist(Boolean(dateRange[dateDiff]?.schedule)));
    }
    // 날짜가 변경되면 수정모드 해제 및 추가된문제 초기화
    dispatch(setIsEdit(false));
    dispatch(setProblemListRes([]));
  }, [selectedDay]);

  useEffect(() => {
    dispatch(setScheduleId(dateRange[selectedDayIdx]?.schedule?.id));
  }, [selectedDayIdx]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MemberInvite roomId={roomId} open={open} setOpen={setOpen} />
      <Grid container spacing={4} sx={{ width: '100%', height: '100%', padding: 5, margin: 0 }}>
        <Grid item xs={2}>
          <RoomTitle>{title}</RoomTitle>
          <RoomMainIntroduction />
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={3}>
            <RoomMainCalendar />
            <RoomMainChat />
          </Stack>
        </Grid>
        <Grid item xs={4} sx={{ paddingRight: 4 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}>
            {isStudyExist && !isEdit ? <RoomMainStudyDetail /> : <RoomMainStudyCreate />}
            <Stack direction="row" spacing={5} sx={{ paddingTop: 3 }}>
              <CBtn
                width="100%"
                height="100%"
                onClick={() => {
                  setOpen(true);
                }}>
                초대
              </CBtn>
              <CBtn
                width="100%"
                height="100%"
                onClick={() => {
                  setPreviewOpen(true);
                  // navigate(`/room/${roomId}/live`, { state: { roomToLive: roomId } });
                }}>
                스터디 라이브 입장
              </CBtn>
            </Stack>
          </div>
        </Grid>
      </Grid>
      <RoomMainSetting />
      <RoomStudyLivePreview open={previewOpen} setOpen={setPreviewOpen} />
    </Box>
  );
}

export default RoomMain;
