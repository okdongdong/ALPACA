import { Box, Grid, Stack, IconButton, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CBtn from '../../Components/Commons/CBtn';
import MemberInvite from '../../Components/Dialogs/MemberInvite';
import RoomMainCalendar from '../../Components/Room/Main/RoomMainCalendar';
import RoomMainChat from '../../Components/Room/Main/RoomMainChat';
import RoomMainIntroduction from '../../Components/Room/Main/RoomMainIntroduction';
import RoomSetting from '../../Components/Dialogs/RoomSetting';
import RoomMainStudyDetail from '../../Components/Room/Main/RoomMainStudyDetail';
import { customAxios } from '../../Lib/customAxios';
import {
  setRoomInfo,
  setMemberDict,
  setSchedules,
  Schedule,
  Member,
  MemberDict,
  changeSelectedDay,
} from '../../Redux/roomReducer';
import { BrowserView, MobileView } from 'react-device-detect';
import DehazeIcon from '@mui/icons-material/Dehaze';
import RoomMainStudyCreate from '../../Components/Room/Main/RoomMainStudyCreate';

const RoomTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'left',
  paddingBottom: theme.spacing(3),
}));

const MRoomTitle = styled('h3')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
  paddingBottom: theme.spacing(3),
  marginTop: '1vh',
}));

function RoomMain() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const title = useSelector((state: any) => state.room.title);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const isStudyExist = useSelector((state: any) => state.room.isStudyExist);
  const isEdit = useSelector((state: any) => state.room.isEdit);

  // 초대 dialog open
  const [open, setOpen] = useState<boolean>(false);
  // chat open
  const [openChat, setOpenChat] = useState<boolean>(false);

  const checkIn = () => {
    setOpenChat((prev) => !prev);
  };
  const checkOut = () => {
    setOpenChat((prev) => !prev);
  };

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
    } catch (e: any) {
      console.log(e.response);
    }
  };

  // 페이지 랜더링시 스터디 기본정보를 가져옴
  useEffect(() => {
    getRoomInfo();
  }, []);

  useEffect(() => {
    // 날짜가 변경되면 수정모드 해제 및 추가된문제 초기화
    // 현재 선택한 날짜에 스터디가 존재하는지 확인
    dispatch(changeSelectedDay(selectedDayIdx));
  }, [selectedDayIdx]);

  return (
    <>
      <BrowserView style={{ height: '100%', width: '100%' }}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <MemberInvite roomId={roomId} open={open} setOpen={setOpen} />
          <RoomSetting setInviteOpen={setOpen} />

          <Grid container spacing={4} sx={{ width: '100%', height: '100%', padding: 5, margin: 0 }}>
            <Grid item xs={4}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={5} sx={{ paddingTop: 3 }}>
                  <RoomTitle>{title}</RoomTitle>
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
                      navigate(`/room/${roomId}/live`, { state: { roomToLive: roomId } });
                    }}>
                    라이브 입장
                  </CBtn>
                </Stack>
                <RoomMainCalendar />
                <RoomMainIntroduction />
                <RoomMainChat />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={3}>
                {isStudyExist && !isEdit ? <RoomMainStudyDetail /> : <RoomMainStudyCreate />}
              </Stack>
            </Grid>
            <Grid item xs={4} sx={{ paddingRight: 4 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}></div>
            </Grid>
          </Grid>
        </Box>
      </BrowserView>
      <MobileView style={{ height: '100%', width: '100%' }}>
        <IconButton
          onClick={checkIn}
          sx={{
            height: '3vh',
            width: '100%',
            position: 'fixed',
            bottom: 0,
            background: theme.palette.main,
            borderRadius: '10px',
            zIndex: 1,
          }}>
          <DehazeIcon sx={{ color: theme.palette.txt }} />
        </IconButton>
        <RoomSetting setInviteOpen={setOpen} />
        <MemberInvite roomId={roomId} open={open} setOpen={setOpen} />
        <MRoomTitle>{title}</MRoomTitle>
        <RoomMainCalendar />
        <Stack direction="row" spacing={5} sx={{ paddingTop: 3 }}></Stack>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
          {isStudyExist && !isEdit ? <RoomMainStudyDetail /> : <RoomMainStudyCreate />}
          <Stack direction="row" spacing={5} sx={{ paddingTop: 3 }}></Stack>
        </div>
        <Collapse in={openChat} sx={{ position: 'absolute', zIndex: 2, bottom: 0, width: '100vw' }}>
          <IconButton
            onClick={checkOut}
            aria-label="close"
            sx={{
              height: '3vh',
              width: '100%',
              background: theme.palette.main,
              borderRadius: '10px',
            }}>
            <DehazeIcon sx={{ color: theme.palette.txt }} />
          </IconButton>
          <RoomMainChat />
        </Collapse>
      </MobileView>
    </>
  );
}

export default RoomMain;
