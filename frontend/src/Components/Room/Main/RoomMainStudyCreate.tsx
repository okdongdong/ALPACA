import { Divider, Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { customAxios } from '../../../Lib/customAxios';
import { setDateRange, setIsStudyExist } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import { DailySchedule } from './RoomMainCalendar';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyCreateAddList from './RoomMainStudyCreateAddList';
import RoomMainStudyCreateSearch from './RoomMainStudyCreateSearch';
import RoomMainStudyCreateTime from './RoomMainStudyCreateTime';
import { ProblemRes } from './RoomMainStudyDetail';

interface AddStudyData {
  id?: number;
  startedAt: Date;
  finishedAt: Date;
  studyId: string;
  toSolveProblems: number[];
}

function RoomMainStudyCreate() {
  const { roomId } = useParams();

  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const isEdit = useSelector((state: any) => state.room.isEdit);
  const scheduleId = useSelector((state: any) => state.room.scheduleId);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const problemListRes = useSelector((state: any) => state.room.problemListRes);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const dateRange = useSelector((state: any) => state.room.dateRange);

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

      problemListRes.forEach((problem: ProblemRes) => {
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

      dispatch(setDateRange(tempDateRange));
      dispatch(setIsStudyExist(true));
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

      problemListRes.forEach((problem: ProblemRes) => {
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
        <RoomMainStudyCreateTime />
        <Divider variant="middle" />
        <RoomMainStudyCreateSearch
          problemList={searchProblemList}
          setProblemList={setSearchProblemList}
        />
        <Divider variant="middle" />
        <RoomMainStudyCreateAddList
          problemList={searchProblemList}
          setProblemList={setSearchProblemList}
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
