import { Divider, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { customAxios } from '../../../Lib/customAxios';
import CBtn from '../../Commons/CBtn';
import { DailySchedule } from './RoomMainCalendar';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyCreateAddList from './RoomMainStudyCreateAddList';
import RoomMainStudyCreateSearch from './RoomMainStudyCreateSearch';
import RoomMainStudyCreateTime from './RoomMainStudyCreateTime';
import { ProblemRes } from './RoomMainStudyDetail';

interface RoomMainStudyCreateProps {
  selectedDay: Date;
  isEdit: boolean;
  scheduleId?: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  problemListRes: ProblemRes[];
  selectedDayIdx: number;
  dateRange: DailySchedule[];
  setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setFinishedAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setProblemListRes: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
  setIsStudyExist: React.Dispatch<React.SetStateAction<boolean>>;
  setDateRange: React.Dispatch<React.SetStateAction<DailySchedule[]>>;
}

interface AddStudyData {
  id?: number;
  startedAt: Date;
  finishedAt: Date;
  studyId: string;
  toSolveProblems: number[];
}

function RoomMainStudyCreate({
  selectedDay,
  isEdit,
  scheduleId = 0,
  startedAt,
  finishedAt,
  problemListRes,
  selectedDayIdx,
  dateRange,
  setStartedAt,
  setFinishedAt,
  setProblemListRes,
  setIsStudyExist,
  setDateRange,
}: RoomMainStudyCreateProps) {
  const { roomId } = useParams();

  const [searchProblemList, setSearchProblemList] = useState<ProblemRes[]>([]);

  const addStudy = async () => {
    try {
      const data: AddStudyData = {
        startedAt: startedAt
          ? new Date(selectedDay.toDateString() + ' ' + startedAt.toTimeString())
          : selectedDay,
        finishedAt: finishedAt
          ? new Date(selectedDay.toDateString() + ' ' + finishedAt.toTimeString())
          : selectedDay,
        studyId: roomId || '',
        toSolveProblems: [],
      };

      problemListRes.forEach((problem) => {
        data.toSolveProblems.push(problem.problemNumber);
      });

      const res = await customAxios({
        method: 'post',
        url: '/schedule',
        data: data,
      });

      const tempDateRange = [...dateRange];
      tempDateRange[selectedDayIdx].schedule = {
        id: res.data.message,
        startedAt: data.startedAt,
        finishedAt: data.finishedAt,
      };

      setDateRange(tempDateRange);
      setIsStudyExist(true);
    } catch (e: any) {
      console.log(e.response);
    }
  };

  const editStudy = async () => {
    try {
      const data: AddStudyData = {
        startedAt: startedAt || selectedDay,
        finishedAt: finishedAt || selectedDay,
        studyId: roomId || '',
        toSolveProblems: [],
      };

      problemListRes.forEach((problem) => {
        data.toSolveProblems.push(problem.problemNumber);
      });

      console.log(data);

      const res = await customAxios({
        method: 'put',
        url: `/schedule/${scheduleId}`,
        data: data,
      });

      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const onClickHandler = () => {
    if (isEdit) {
      editStudy();
    } else {
      addStudy();
    }
  };

  return (
    <RoomMainComponentContainer height="100%">
      <Stack justifyContent="space-between" sx={{ padding: 2, height: '100%' }} spacing={2}>
        <h2 style={{ textAlign: 'left' }}>{isEdit ? `스터디 일정변경` : `스터디 일정추가`}</h2>
        <Divider variant="middle" />
        <RoomMainStudyCreateTime
          selectedDay={selectedDay}
          startedAt={startedAt}
          setStartedAt={setStartedAt}
          finishedAt={finishedAt}
          setFinishedAt={setFinishedAt}
        />
        <Divider variant="middle" />
        <RoomMainStudyCreateSearch
          problemList={searchProblemList}
          setProblemList={setSearchProblemList}
          addedProblemList={problemListRes}
          setAddedProblemList={setProblemListRes}
        />
        <Divider variant="middle" />
        <RoomMainStudyCreateAddList
          problemList={searchProblemList}
          setProblemList={setSearchProblemList}
          addedProblemList={problemListRes}
          setAddedProblemList={setProblemListRes}
        />
        <div style={{ width: '100%', justifyContent: 'end', display: 'flex' }}>
          <CBtn width={130} height="100%" onClick={onClickHandler}>
            스터디등록
          </CBtn>
        </div>
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyCreate;
