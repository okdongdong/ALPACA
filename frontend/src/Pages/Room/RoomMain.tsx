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
import RoomStudyLivePreview from '../../Components/Room/StudyLive/RoomStudyLivePreview';
import { customAxios } from '../../Lib/customAxios';
import {
  setRoomInfo,
  setMemberDict,
  setSchedules,
  Schedule,
  Member,
  MemberDict,
  changeSelectedDay,
  setIsRoomMaker,
  resetRoomInfo,
} from '../../Redux/roomReducer';
import { BrowserView, MobileView } from 'react-device-detect';
import DehazeIcon from '@mui/icons-material/Dehaze';
import RoomMainStudyCreate from '../../Components/Room/Main/RoomMainStudyCreate';
import { Study } from '../../Redux/accountReducer';
import useAlert from '../../Hooks/useAlert';

const RoomTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'left',
}));

const MRoomTitle = styled('h3')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
  paddingBottom: theme.spacing(3),
  marginTop: '1vh',
}));

function RoomMain() {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cAlert = useAlert();
  const theme = useTheme();

  const userId = useSelector((state: any) => state.account.userId);
  const studies = useSelector((state: any) => state.account.studies);
  const title = useSelector((state: any) => state.room.title);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const isStudyExist = useSelector((state: any) => state.room.isStudyExist);
  const isEdit = useSelector((state: any) => state.room.isEdit);
  // ?????? dialog open
  const [open, setOpen] = useState<boolean>(false);
  // chat open
  const [openChat, setOpenChat] = useState<boolean>(false);

  const checkIn = () => {
    setOpenChat((prev) => !prev);
  };
  const checkOut = () => {
    setOpenChat((prev) => !prev);
  };

  // preview dialog open
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // ?????? ????????? ?????? ?????? ???????????? ????????? ??????
  const studyCheck = async () => {
    if (studies.every((study: Study) => `${study.id}` !== roomId)) {
      await cAlert.fire({
        title: '????????? ???????????????!',
        text: '?????????????????? ???????????????',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/');
      return false;
    }
    return true;
  };

  // ???????????? ????????????
  const getRoomInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}`,
        params: {
          offset: new Date().getTimezoneOffset(),
        },
      });

      // console.log('roomInfo: ', res);
      dispatch(setRoomInfo(res.data));

      if (res.data.members.some((member: Member) => member.userId === userId && member.roomMaker)) {
        dispatch(setIsRoomMaker(true));
      }

      // ???????????? ????????? ????????? Date??? ??????
      const tempSchedules: Schedule[] = [];
      res.data.scheduleListRes.forEach((schedule: Schedule) => {
        const startedAt = new Date(schedule.startedAt);
        const finishedAt = new Date(schedule.finishedAt);
        tempSchedules.push({ id: schedule.id, startedAt, finishedAt });
      });
      dispatch(setSchedules(tempSchedules));

      // ???????????? dict??????{id:info}??? ??????
      const tempDict: MemberDict = {};
      res.data.members.forEach((member: Member) => {
        tempDict[member.userId] = { nickname: member.nickname, profileImg: member.profileImg };
      });
      dispatch(setMemberDict(tempDict));
      // console.log('userDict:', tempDict);
    } catch (e: any) {
      // console.log(e.response);
      // console.log(e);
    }
  };

  const initSequence = async () => {
    if (await studyCheck()) getRoomInfo();
  };
  // ????????? ???????????? ????????? ??????????????? ?????????
  useEffect(() => {
    initSequence();
    return () => {
      dispatch(resetRoomInfo());
    };
  }, []);

  useEffect(() => {
    // ????????? ???????????? ???????????? ?????? ??? ??????????????? ?????????
    // ?????? ????????? ????????? ???????????? ??????????????? ??????
    dispatch(changeSelectedDay(selectedDayIdx));
  }, [selectedDayIdx]);

  return (
    <>
      <BrowserView style={{ height: '100%', width: '100%' }}>
        <Box sx={{ height: '100%', width: '100%' }}>
          <MemberInvite roomId={roomId} open={open} setOpen={setOpen} />
          <RoomSetting setInviteOpen={setOpen} />
          <Grid container spacing={4} sx={{ width: '100%', height: '100%', px: 5, margin: 0 }}>
            <Grid item xs={12} md={5} lg={3} sx={{ paddingBottom: 4 }}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                <Stack
                  direction="row"
                  spacing={5}
                  sx={{ paddingTop: 3 }}
                  justifyContent="space-between"
                  alignItems="center">
                  <RoomTitle>{title}</RoomTitle>
                  <CBtn
                    height="100%"
                    onClick={() => {
                      setPreviewOpen(true);
                    }}>
                    ????????? ??????
                  </CBtn>
                </Stack>
                <RoomMainIntroduction />
                <RoomMainChat />
              </Stack>
            </Grid>
            <Grid item xs={12} md={7} lg={9} style={{ paddingLeft: 0, paddingRight: 4 }}>
              <Grid container spacing={4} sx={{ width: '100%', height: '100%', margin: 0 }}>
                <Grid item xs={12} md={12} lg={7}>
                  <RoomMainCalendar />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={5}
                  sx={{
                    paddingBottom: 4,
                  }}>
                  <Stack
                    spacing={3}
                    sx={{
                      height: '100%',
                      [theme.breakpoints.down('lg')]: {
                        height: '50vh',
                      },
                    }}>
                    {isStudyExist && !isEdit ? <RoomMainStudyDetail /> : <RoomMainStudyCreate />}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <RoomStudyLivePreview open={previewOpen} setOpen={setPreviewOpen} />
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
