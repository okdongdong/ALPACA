import { Remove } from '@mui/icons-material';
import { alpha, Box, Divider, IconButton, Stack, styled, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProblemListRes } from '../../../Redux/roomReducer';
import CProblem from '../../Commons/CProblem';
import { ProblemRes } from './RoomMainStudyDetail';

interface RoomMainStudyCreateAddListProps {
  problemList: ProblemRes[];
  setProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.warn,
  color: theme.palette.icon,
  width: 30,
  height: 30,
  marginRight: theme.spacing(2),
}));

const ProblemBox = styled('div')(({ theme }) => ({
  height: '15vh',
  borderRadius: 10,
  backgroundColor: theme.palette.bg,
}));

function RoomMainStudyCreateAddList({
  problemList,
  setProblemList,
}: RoomMainStudyCreateAddListProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const problemListRes = useSelector((state: any) => state.room.problemListRes);
  const deleteProblem = (idx: number) => {
    const tempAddedProblem = [...problemListRes];
    const deletedProblem = tempAddedProblem.splice(idx, 1);
    const newProblemList = [...problemList, ...deletedProblem];

    setProblemList(newProblemList);
    dispatch(setProblemListRes(tempAddedProblem));
  };
  return (
    <Stack spacing={1} sx={{ height: '50%', my: 1 }}>
      <h3>추가된 문제</h3>
      <Divider variant="middle" />
      <ProblemBox className="scroll-box" sx={{ height: '80%', position: 'relative' }}>
        <Box sx={{ position: 'absolute', width: '100%' }}>
          {problemListRes.map((problem: ProblemRes, idx: number) => (
            <CProblem
              key={idx}
              backgroundColor={idx % 2 ? '' : alpha(theme.palette.main, 0.3)}
              number={problem.problemNumber}
              title={problem.title}
              level={problem.level}
              button={
                <CustomIconButton>
                  <Remove onClick={() => deleteProblem(idx)} />
                </CustomIconButton>
              }
            />
          ))}
        </Box>
      </ProblemBox>
    </Stack>
  );
}

export default RoomMainStudyCreateAddList;
