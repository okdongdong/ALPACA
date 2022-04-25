import { Grid, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DUMMY_STUDY_DATA } from '../../Assets/dummyData/dummyData';
import RoomMainCalendar, { DailySchedule } from '../../Components/Room/Main/RoomMainCalendar';
import RoomMainIntroduction from '../../Components/Room/Main/RoomMainIntroduction';
import RoomMainStudyCreate from '../../Components/Room/Main/RoomMainStudyCreate';
import RoomMainStudyDetail from '../../Components/Room/Main/RoomMainStudyDetail';
import { customAxios } from '../../Lib/customAxios';

interface Member {
  userId: number;
  isRoomMaker: boolean;
  nickname: string;
  profileImg: string;
}

export interface Schedule {
  id: number;
  finishedAt: Date;
  startedAt: Date;
}

const RoomTitle = styled('h1')(({ theme }) => ({
  color: theme.palette.txt,
  paddingLeft: theme.spacing(5),
}));

function RoomMain() {
  const { roomId } = useParams();

  const [title, setTitle] = useState<string>('');
  const [info, setInfo] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isStudyExist, setIsStudyExist] = useState<boolean>(false);

  // 현재 달력의 날짜계산 및 스케줄저장을 위한 변수
  const [dateRange, setDateRange] = useState<DailySchedule[]>([]);

  // 스터디룸 정보조회
  const getRoomInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}`,
      });

      setTitle(res.data.title);
      setInfo(res.data.info);
      setMembers(res.data.members);
      setSchedules(res.data.schedules);
    } catch (e) {}
  };

  const seyScheduleHandler = () => {
    const tempSchedules: Schedule[] = [];

    DUMMY_STUDY_DATA.scheduleListRes.map((scheduleRes) => {
      const temp = {
        id: scheduleRes.id,
        finishedAt: new Date(scheduleRes.finishedAt),
        startedAt: new Date(scheduleRes.startedAt),
      };
      tempSchedules.push(temp);
    });

    setSchedules(tempSchedules);
  };

  // 페이지 랜더링시 스터디 기본정보를 가져옴
  useEffect(() => {
    getRoomInfo();
    setTitle(DUMMY_STUDY_DATA.title);
    setInfo(DUMMY_STUDY_DATA.info);
    setMembers(DUMMY_STUDY_DATA.members);
    seyScheduleHandler();
    console.log(schedules);
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
  }, [selectedDay]);

  return (
    <div>
      <RoomTitle>{title}</RoomTitle>
      <Grid container spacing={4} sx={{ padding: 5 }}>
        <Grid item xs={2}>
          <RoomMainIntroduction info={info} members={members} />
        </Grid>
        <Grid item xs={6}>
          <RoomMainCalendar
            schedules={schedules}
            selectedDay={selectedDay}
            dateRange={dateRange}
            setSelectedDay={setSelectedDay}
            setDateRange={setDateRange}
          />
        </Grid>
        <Grid item xs={4}>
          {isStudyExist ? (
            <RoomMainStudyDetail
              selectedDay={selectedDay}
              selectedDayIdx={selectedDayIdx}
              dateRange={dateRange}
            />
          ) : (
            <RoomMainStudyCreate selectedDay={selectedDay} />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default RoomMain;
