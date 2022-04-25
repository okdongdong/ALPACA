import { Delete, Edit } from '@mui/icons-material';
import { Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
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
}

export interface ToSolveProblem {
  id: string;
  inputs?: string[];
  level: number;
  number: number;
  outputs?: string[];
  title: string;
}

function RoomMainStudyDetail({ selectedDay, selectedDayIdx, dateRange }: RoomMainStudyDetailProps) {
  const theme = useTheme();

  const [startedAt, setStartedAt] = useState<Date>(selectedDay);
  const [finishedAt, setFinishedAt] = useState<Date>(selectedDay);
  const [toSolveProblems, setToSolveProblems] = useState<ToSolveProblem[]>([]);

  const getScheduleProblems = async () => {
    try {
      const scheduleId = dateRange[selectedDayIdx].schedule?.id;
      const res = await customAxios({
        method: 'get',
        url: `/schedule/${scheduleId}`,
      });

      console.log(res);
      setStartedAt(res.data.startedAt);
      setFinishedAt(res.data.finishedAt);
      setToSolveProblems(res.data.toSolveProblems);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getScheduleProblems();
  }, [selectedDay]);

  return (
    <RoomMainComponentContainer>
      <Stack>
        <div>
          <h1 style={{ textAlign: 'center' }}>스터디 상세정보</h1>
          <CBtn content={<Delete sx={{ color: theme.palette.icon }} />} onClick={() => {}} />
          <CBtn content={<Edit sx={{ color: theme.palette.icon }} />} onClick={() => {}} />
        </div>
        <div>일시 : {`${dateToString(startedAt)} ~ ${dateToStringTime(finishedAt)}`}</div>
        {toSolveProblems.map((problem, idx) => (
          <RoomMainStudyDetailProblemItem
            key={idx}
            problemId={problem.id}
            number={problem.number}
            level={problem.level}
            title={problem.title}
          />
        ))}
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyDetail;
