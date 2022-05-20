import { Divider, Stack, Box, useTheme } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useAlert from '../../../Hooks/useAlert';
import { customAxios } from '../../../Lib/customAxios';
import { addSchedule, setIsEdit, setIsStudyExist } from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
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
  const theme = useTheme();
  const cAlert = useAlert();
  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const isEdit = useSelector((state: any) => state.room.isEdit);
  const scheduleId = useSelector((state: any) => state.room.scheduleId);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const problemListRes = useSelector((state: any) => state.room.problemListRes);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);

  const [searchProblemList, setSearchProblemList] = useState<ProblemRes[]>([]);

  const addStudy = async () => {
    try {
      const tempStarted = new Date(selectedDay);
      const tempFinished = new Date(selectedDay);
      tempStarted.setHours(startedAt.getHours(), startedAt.getMinutes());
      tempFinished.setHours(finishedAt.getHours(), finishedAt.getMinutes());

      const data: AddStudyData = {
        startedAt: tempStarted,
        finishedAt: tempFinished,
        studyId: roomId || '',
        toSolveProblems: [],
      };

      // console.log(data);

      problemListRes.forEach((problem: ProblemRes) => {
        data.toSolveProblems.push(problem.problemNumber);
      });

      const res = await customAxios({
        method: 'post',
        url: '/schedule',
        data: data,
      });
      // console.log('added:', res);

      const idx = selectedDayIdx;
      const schedule = {
        id: res.data.message,
        startedAt: data.startedAt,
        finishedAt: data.finishedAt,
      };

      dispatch(addSchedule({ idx, schedule }));
      dispatch(setIsStudyExist(true));
      cAlert.fire({
        title: '추가 성공!',
        text: '스터디 일정을 추가했습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: any) {
      cAlert.fire({
        title: '추가 실패!',
        text: e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      // console.log(e.response);
    }
  };

  const editStudy = async () => {
    try {
      const tempStarted = new Date(selectedDay);
      const tempFinished = new Date(selectedDay);

      tempStarted.setHours(startedAt.getHours(), startedAt.getMinutes());
      tempFinished.setHours(finishedAt.getHours(), finishedAt.getMinutes());

      const data: AddStudyData = {
        startedAt: new Date(tempStarted),
        finishedAt: new Date(tempFinished),
        studyId: roomId || '',
        toSolveProblems: [],
      };

      // console.log(data);

      problemListRes.forEach((problem: ProblemRes) => {
        data.toSolveProblems.push(problem.problemNumber);
      });

      await customAxios({
        method: 'put',
        url: `/schedule/${scheduleId}`,
        data: data,
      });
      // console.log('updated:', res);
      dispatch(setIsEdit(false));
      cAlert.fire({
        title: '변경 성공!',
        text: '스터디 일정을 변경했습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: any) {
      cAlert.fire({
        title: '변경 실패!',
        text: e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      // console.log(e.response);
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
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <Stack
          justifyContent="space-between"
          sx={{ padding: 2, height: 'fit-content', position: 'relative' }}
          spacing={1}>
          <div style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
            <h2 style={{ textAlign: 'left' }}>{isEdit ? `스터디 일정변경` : `스터디 일정추가`}</h2>
            <CBtn width={130} height="100%" onClick={onClickHandler}>
              {isEdit ? '스터디 수정' : '스터디 등록'}
            </CBtn>
          </div>
          <Divider variant="middle" />
          <RoomMainStudyCreateTime />
          <Divider variant="middle" />
        </Stack>
        <Box
          sx={{
            width: '100%',
            height: '63vh',
            flexGrow: 1,
            position: 'relative',
            [theme.breakpoints.down('lg')]: {
              height: '20vh',
            },
          }}
          className="scroll-box">
          <Box
            sx={{ padding: 2 }}
            style={{
              width: '100%',
              height: '100%',
            }}>
            <RoomMainStudyCreateSearch
              problemList={searchProblemList}
              setProblemList={setSearchProblemList}
            />
            <RoomMainStudyCreateAddList
              problemList={searchProblemList}
              setProblemList={setSearchProblemList}
            />
          </Box>
        </Box>
      </div>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyCreate;
