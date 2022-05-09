import { Box, Grid, Stack, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DUMMY_STUDY_DATA } from '../../Assets/dummyData/dummyData';
import CBtn from '../../Components/Commons/CBtn';
import MemberInvite from '../../Components/Dialogs/MemberInvite';
import RoomMainCalendar, { DailySchedule } from '../../Components/Room/Main/RoomMainCalendar';
import RoomMainChat from '../../Components/Room/Main/RoomMainChat';
import RoomMainIntroduction from '../../Components/Room/Main/RoomMainIntroduction';
import RoomMainSetting from '../../Components/Room/Main/RoomMainSetting';
import RoomMainStudyCreate from '../../Components/Room/Main/RoomMainStudyCreate';
import RoomMainStudyDetail, { ProblemRes } from '../../Components/Room/Main/RoomMainStudyDetail';
import { customAxios } from '../../Lib/customAxios';
import { setRoomInfo } from '../../Redux/roomReducer';

export interface Member {
  userId: number;
  isRoomMaker: boolean;
  nickname: string;
  profileImg: string;
}

export interface MemberDict {
  [key: number]: { nickname: string; profileImg: string };
}

export interface Schedule {
  id: number;
  finishedAt: Date;
  startedAt: Date;
}

const RoomTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'left',
  paddingBottom: theme.spacing(3),
}));

function RoomMain() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [memberDict, setMemberDict] = useState<MemberDict>({});
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isStudyExist, setIsStudyExist] = useState<boolean>(false);

  // 현재 달력의 날짜계산 및 스케줄저장을 위한 변수
  const [dateRange, setDateRange] = useState<DailySchedule[]>([]);

  // 일정 수정모드 체크
  const [isEdit, setIsEdit] = useState(false);

  // 스터디 조회
  const [startedAt, setStartedAt] = useState<Date | null>(new Date(selectedDay));
  const [finishedAt, setFinishedAt] = useState<Date | null>(new Date(selectedDay));
  const [problemListRes, setProblemListRes] = useState<ProblemRes[]>([]);

  // 채팅 이전기록 조회
  const [offsetId, setOffsetId] = useState<string>('');

  // 초대 dialog open
  const [open, setOpen] = useState<boolean>(false);

  // 스터디룸 정보조회
  const getRoomInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}`,
      });

      console.log('roomInfo: ', res);

      setTitle(res.data.title);
      setInfo(res.data.info);
      setMembers(res.data.members);
      setOffsetId(res.data.offsetId);
      dispatch(setRoomInfo(res.data));
      // 문자열로 받아진 스케줄 Date로 변환
      const tempSchedules: Schedule[] = [];
      res.data.scheduleListRes.forEach((schedule: Schedule) => {
        const startedAt = new Date(schedule.startedAt);
        const finishedAt = new Date(schedule.finishedAt);
        tempSchedules.push({ id: schedule.id, startedAt, finishedAt });
      });
      setSchedules(tempSchedules);

      // 유저정보 dict형태{id:info}로 저장
      const tempDict: MemberDict = {};
      res.data.members.forEach((member: Member) => {
        tempDict[member.userId] = { nickname: member.nickname, profileImg: member.profileImg };
      });
      setMemberDict(tempDict);
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
      setSelectedDayIdx(dateDiff);
      setIsStudyExist(Boolean(dateRange[dateDiff].schedule));
    }
    // 날짜가 변경되면 수정모드 해제 및 추가된문제 초기화
    setIsEdit(false);
    setProblemListRes([]);
  }, [selectedDay]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <RoomMainSetting />
      <MemberInvite roomId={roomId} open={open} setOpen={setOpen} />
      <Grid container spacing={4} sx={{ width: '100%', height: '100%', padding: 5, margin: 0 }}>
        <Grid item xs={2}>
          <RoomTitle>{title}</RoomTitle>
          <RoomMainIntroduction info={info} members={members} setMembers={setMembers} />
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={3}>
            <RoomMainCalendar
              roomId={roomId}
              schedules={schedules}
              selectedDay={selectedDay}
              dateRange={dateRange}
              setSchedules={setSchedules}
              setSelectedDay={setSelectedDay}
              setDateRange={setDateRange}
            />
            <RoomMainChat roomId={roomId} memberDict={memberDict} offsetId={offsetId} />
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
            {isStudyExist && !isEdit ? (
              <RoomMainStudyDetail
                selectedDay={selectedDay}
                selectedDayIdx={selectedDayIdx}
                dateRange={dateRange}
                startedAt={startedAt}
                finishedAt={finishedAt}
                problemListRes={problemListRes}
                setStartedAt={setStartedAt}
                setFinishedAt={setFinishedAt}
                setProblemListRes={setProblemListRes}
                setIsEdit={setIsEdit}
                setIsStudyExist={setIsStudyExist}
              />
            ) : (
              <RoomMainStudyCreate
                scheduleId={dateRange[selectedDayIdx]?.schedule?.id}
                startedAt={startedAt}
                finishedAt={finishedAt}
                problemListRes={problemListRes}
                dateRange={dateRange}
                selectedDayIdx={selectedDayIdx}
                selectedDay={selectedDay}
                isEdit={isEdit}
                setStartedAt={setStartedAt}
                setFinishedAt={setFinishedAt}
                setProblemListRes={setProblemListRes}
                setIsStudyExist={setIsStudyExist}
                setDateRange={setDateRange}
              />
            )}
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
                  navigate(`/room/${roomId}/live`, { state: { roomToLive: roomId } });
                }}>
                스터디 라이브 입장
              </CBtn>
            </Stack>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RoomMain;
