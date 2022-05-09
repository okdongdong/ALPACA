import { Delete, Edit } from '@mui/icons-material';
import { Divider, Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringTime } from '../../../Lib/dateToString';
import {
  setFinishedAt,
  setIsEdit,
  setIsStudyExist,
  setProblemListRes,
  setStartedAt,
} from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyDetailProblemItem from './RoomMainStudyDetailProblemItem';

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

function RoomMainStudyDetail() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const dateRange = useSelector((state: any) => state.room.dateRange);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const problemListRes = useSelector((state: any) => state.room.problemListRes);

  const getScheduleProblems = async () => {
    try {
      const scheduleId = dateRange[selectedDayIdx].schedule?.id;
      const res = await customAxios({
        method: 'get',
        url: `/schedule/${scheduleId}`,
      });

      dispatch(setStartedAt(new Date(res.data.startedAt)));
      dispatch(setFinishedAt(new Date(res.data.finishedAt)));
      dispatch(setProblemListRes(res.data.problemListRes));
    } catch (e: any) {
      console.log(e.response);
    }
  };

  const deleteStudy = async () => {
    try {
      const scheduleId = dateRange[selectedDayIdx].schedule?.id;
      await customAxios({ method: 'delete', url: `/schedule/${scheduleId}` });
      dispatch(setIsStudyExist(false));
    } catch (e: any) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    console.log('selectedDay: ', selectedDay);
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
              onClick={deleteStudy}
            />
            <CBtn
              height="100%"
              content={<Edit sx={{ color: theme.palette.icon }} />}
              onClick={() => {
                dispatch(setIsEdit(true));
              }}
            />
          </Stack>
        </div>
        <Divider variant="middle" />

        <div>일시 : {`${dateToString(startedAt)} ~ ${dateToStringTime(finishedAt)}`}</div>

        <h3 style={{ marginTop: '24px' }}>스터디 문제</h3>
        <Divider variant="middle" />
        <Stack className="scroll-box" spacing={1} sx={{ height: '55vh' }}>
          {problemListRes.map((problem: ProblemRes, idx: number) => (
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
