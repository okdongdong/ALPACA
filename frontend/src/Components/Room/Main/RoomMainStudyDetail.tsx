import { Delete, Edit } from '@mui/icons-material';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringTime } from '../../../Lib/dateToString';
import {
  deleteSchedule,
  resetProblemList,
  setFinishedAt,
  setIsEdit,
  setIsStudyExist,
  setProblemListRes,
  setStartedAt,
} from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyDetailProblemItem from './RoomMainStudyDetailProblemItem';
import { BrowserView, MobileView } from 'react-device-detect';
import useAlert from '../../../Hooks/useAlert';
import { setLoading } from '../../../Redux/commonReducer';

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

  const scheduleId = useSelector((state: any) => state.room.scheduleId);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const dateRange = useSelector((state: any) => state.room.dateRange);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const problemListRes = useSelector((state: any) => state.room.problemListRes);

  const cAlert = useAlert();

  const getScheduleProblems = async () => {
    if (scheduleId === undefined) return;

    try {
      const res = await customAxios({
        method: 'get',
        url: `/schedule/${scheduleId}`,
      });
      console.log('getScheduleProblems: ', res);
      dispatch(setStartedAt(new Date(res.data.startedAt)));
      dispatch(setFinishedAt(new Date(res.data.finishedAt)));
      dispatch(setProblemListRes(res.data.problemListRes));
    } catch (e: any) {
      console.log(e.response);
    }
  };

  const deleteStudy = async () => {
    dispatch(setLoading(true));
    try {
      const scheduleId = dateRange[selectedDayIdx].schedule?.id;
      await customAxios({ method: 'delete', url: `/schedule/${scheduleId}` });
      dispatch(deleteSchedule());
      dispatch(setLoading(false));
      cAlert.fire({
        title: '삭제 성공!',
        text: '스터디 일정을 삭제했습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: any) {
      console.log(e.response);
      dispatch(setLoading(false));
      cAlert.fire({
        title: '삭제 실패!',
        text: e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onDeleteHandler = async () => {
    const result = await cAlert.fire({
      title: '스터디 일정을 삭제하시겠습니까?',
      text: '스터디 일정이 영구적으로 삭제됩니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.warn,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '삭제',
    });

    if (result.isConfirmed) deleteStudy();
  };

  useEffect(() => {
    console.log('selectedDay: ', dateRange[selectedDayIdx]?.day);
    getScheduleProblems();
  }, [scheduleId]);

  return (
    <>
      <BrowserView style={{ width: '100%', height: '100%' }}>
        <RoomMainComponentContainer height="100%">
          <Stack spacing={1} sx={{ padding: 2, height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center' }}>스터디 상세정보</h2>
              <Stack direction="row" spacing={1}>
                <CBtn
                  height="100%"
                  content={<Delete sx={{ color: theme.palette.icon }} />}
                  onClick={onDeleteHandler}
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
            <Stack className="scroll-box" spacing={1} sx={{ height: '100%', position: 'relative' }}>
              <Box sx={{ position: 'absolute', width: '100%' }}>
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
              </Box>
            </Stack>
          </Stack>
        </RoomMainComponentContainer>
      </BrowserView>

      <MobileView>
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
      </MobileView>
    </>
  );
}

export default RoomMainStudyDetail;
