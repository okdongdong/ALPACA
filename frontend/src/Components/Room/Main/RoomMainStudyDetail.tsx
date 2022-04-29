import { Delete, Edit } from '@mui/icons-material';
import { Divider, Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_SCHEDULE_RES_DATA } from '../../../Assets/dummyData/dummyData';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringTime } from '../../../Lib/dateToString';
import CBtn from '../../Commons/CBtn';
import { DailySchedule } from './RoomMainCalendar';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyDetailProblemItem from './RoomMainStudyDetailProblemItem';

interface RoomMainStudyDetailProps {
  selectedDay: Date;
  selectedDayIdx: number;
  dateRange: DailySchedule[];
  startedAt: Date | null;
  finishedAt: Date | null;
  problemListRes: ProblemRes[];
  setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setFinishedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setProblemListRes: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ToSolveProblem {
  id: string;
  level: number;
  number: number;
  title: string;
}

export interface SolvedMemeberList {
  bojId: string;
  id: number;
  info: string;
  nickname: string;
  preferredLanguage: string;
  profileImg: string;
  theme: string;
  username: string;
}

export interface ProblemRes {
  level: number;
  problemNumber: number;
  title: string;
  solvedMemberList?: SolvedMemeberList[];
}

function RoomMainStudyDetail({
  selectedDay,
  selectedDayIdx,
  dateRange,
  startedAt,
  finishedAt,
  problemListRes,
  setStartedAt,
  setFinishedAt,
  setProblemListRes,
  setIsEdit,
}: RoomMainStudyDetailProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const getScheduleProblems = async () => {
    try {
      const scheduleId = dateRange[selectedDayIdx].schedule?.id;
      // const res = await customAxios({
      //   method: 'get',
      //   url: `/schedule/${scheduleId}`,
      // });

      const res = DUMMY_SCHEDULE_RES_DATA;

      console.log(res);
      // setStartedAt(new Date(res.data.startedAt));
      // setFinishedAt(new Date(res.data.finishedAt));
      // setProblemListRes(res.data.problemListRes);
      setStartedAt(new Date(res.startedAt));
      setFinishedAt(new Date(res.finishedAt));
      setProblemListRes(res.problemListRes);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteStudy = () => {};

  useEffect(() => {
    getScheduleProblems();
  }, [selectedDay]);

  return (
    <RoomMainComponentContainer height="100%">
      <Stack spacing={1} sx={{ padding: 2, height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>스터디 상세정보</h2>
          <Stack direction="row" spacing={1}>
            <CBtn
              height="100%"
              content={<Delete sx={{ color: theme.palette.icon }} />}
              onClick={() => {}}
            />
            <CBtn
              height="100%"
              content={<Edit sx={{ color: theme.palette.icon }} />}
              onClick={() => {
                setIsEdit(true);
              }}
            />
          </Stack>
        </div>
        <Divider variant="middle" />

        <div>일시 : {`${dateToString(startedAt)} ~ ${dateToStringTime(finishedAt)}`}</div>

        <h3 style={{ marginTop: '24px' }}>스터디 문제</h3>
        <Divider variant="middle" />
        <Stack className="scroll-box" spacing={1} sx={{ height: '55vh' }}>
          {problemListRes.map((problem, idx) => (
            <RoomMainStudyDetailProblemItem
              key={idx}
              problemId={problem.problemNumber}
              number={problem.problemNumber}
              level={problem.level}
              title={problem.title}
              members={problem.solvedMemberList}
            />
          ))}
        </Stack>
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyDetail;
