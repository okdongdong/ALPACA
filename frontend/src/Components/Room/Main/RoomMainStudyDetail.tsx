import { Delete, Edit } from '@mui/icons-material';
import { alpha, Box, Divider, Stack, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import { dateToStringDate, dateToStringTime } from '../../../Lib/dateToString';
import {
  deleteSchedule,
  setFinishedAt,
  setIsEdit,
  setProblemListRes,
  setStartedAt,
} from '../../../Redux/roomReducer';
import CBtn from '../../Commons/CBtn';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyDetailProblemItem from './RoomMainStudyDetailProblemItem';
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
  isSolved?: boolean;
  solvedMemberList?: SolvedMemeberList[];
}

function RoomMainStudyDetail() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const scheduleId = useSelector((state: any) => state.room.scheduleId);
  const selectedDay = useSelector((state: any) => state.room.selectedDay);
  const selectedDayIdx = useSelector((state: any) => state.room.selectedDayIdx);
  const dateRange = useSelector((state: any) => state.room.dateRange);
  const startedAt = useSelector((state: any) => state.room.startedAt);
  const finishedAt = useSelector((state: any) => state.room.finishedAt);
  const problemListRes = useSelector((state: any) => state.room.problemListRes);
  const isEdit = useSelector((state: any) => state.room.isEdit);

  const cAlert = useAlert();

  const getScheduleProblems = async () => {
    if (scheduleId === undefined) return;

    try {
      const res = await customAxios({
        method: 'get',
        url: `/schedule/${scheduleId}`,
      });
      // console.log('getScheduleProblems: ', res);
      dispatch(setStartedAt(new Date(res.data.startedAt)));
      dispatch(setFinishedAt(new Date(res.data.finishedAt)));
      dispatch(setProblemListRes(res.data.problemListRes));
    } catch (e: any) {
      // console.log(e.response);
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
        title: '?????? ??????!',
        text: '????????? ????????? ??????????????????.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: any) {
      // console.log(e.response);
      dispatch(setLoading(false));
      cAlert.fire({
        title: '?????? ??????!',
        text: e.response.data.message || '?????? ??? ?????? ??????????????????.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onDeleteHandler = async () => {
    const result = await cAlert.fire({
      title: '????????? ????????? ?????????????????????????',
      text: '????????? ????????? ??????????????? ???????????????.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.warn,
      cancelButtonColor: theme.palette.component,
      confirmButtonText: '??????',
    });

    if (result.isConfirmed) deleteStudy();
  };

  useEffect(() => {
    // console.log('selectedDay: ', dateRange[selectedDayIdx]?.day);
    getScheduleProblems();
  }, [scheduleId]);

  useEffect(() => {
    return () => {
      if (isEdit) dispatch(setIsEdit(false));
    };
  }, []);

  return (
    <RoomMainComponentContainer height="100%">
      <Stack spacing={1} sx={{ padding: 2, height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>????????? ????????????</h2>
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

        <div>
          ?????? :{' '}
          {`${dateToStringDate(selectedDay)} ${dateToStringTime(startedAt)} ~ ${dateToStringTime(
            finishedAt,
          )}`}
        </div>

        <h3 style={{ marginTop: '24px' }}>????????? ??????</h3>
        <Divider variant="middle" />
        <Stack className="scroll-box" spacing={1} sx={{ height: '100%', position: 'relative' }}>
          <Box sx={{ position: 'absolute', width: '100%' }}>
            {problemListRes.length === 0 && (
              <Stack
                padding={5}
                spacing={5}
                alignItems="center"
                sx={{
                  backgroundColor: theme.palette.bg,
                  color: alpha(theme.palette.txt, 0.5),
                  width: '100%',
                  borderRadius: '10px',
                  marginTop: '8px',
                  display: 'flex',
                }}>
                <div>????????? ????????? ????????????.</div>

                <CBtn
                  height="100%"
                  onClick={() => {
                    dispatch(setIsEdit(true));
                  }}>
                  ?????? ?????? ??????
                </CBtn>
              </Stack>
            )}
            {problemListRes.map((problem: ProblemRes, idx: number) => (
              <RoomMainStudyDetailProblemItem
                key={idx}
                problemId={problem.problemNumber}
                number={problem.problemNumber}
                level={problem.level}
                title={problem.title}
                members={problem.solvedMemberList}
                isSolved={problem.isSolved}
              />
            ))}
          </Box>
        </Stack>
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyDetail;
