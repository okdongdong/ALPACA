import { Remove } from '@mui/icons-material';
import { alpha, Divider, IconButton, styled, useTheme } from '@mui/material';
import React from 'react';
import CProblem from '../../Commons/CProblem';
import { ProblemRes } from './RoomMainStudyDetail';

interface RoomMainStudyCreateAddListProps {
  problemList: ProblemRes[];
  addedProblemList: ProblemRes[];
  setProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
  setAddedProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.warn,
  color: theme.palette.icon,
  width: 30,
  height: 30,
  marginRight: theme.spacing(2),
}));

const ProblemBox = styled('div')(({ theme }) => ({
  height: '20vh',
  borderRadius: 10,
  backgroundColor: theme.palette.bg,
}));

function RoomMainStudyCreateAddList({
  problemList,
  addedProblemList,
  setProblemList,
  setAddedProblemList,
}: RoomMainStudyCreateAddListProps) {
  const theme = useTheme();
  const deleteProblem = (idx: number) => {
    const tempAddedProblem = [...addedProblemList];
    const deletedProblem = tempAddedProblem.splice(idx, 1);
    const newProblemList = [...problemList, ...deletedProblem];

    setProblemList(newProblemList);
    setAddedProblemList(tempAddedProblem);
  };
  return (
    <div style={{ height: '50%' }}>
      <h3>추가된 문제</h3>
      <Divider variant="middle" sx={{ margin: 0 }} />
      <ProblemBox className="scroll-box">
        {addedProblemList.map((problem, idx) => (
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
      </ProblemBox>
    </div>
  );
}

export default RoomMainStudyCreateAddList;
