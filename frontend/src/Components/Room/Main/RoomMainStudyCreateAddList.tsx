import { Remove } from '@mui/icons-material';
import { Icon, IconButton, styled } from '@mui/material';
import React from 'react';
import CProblem from '../../Commons/CProblem';
import { ToSolveProblem } from './RoomMainStudyDetail';

interface RoomMainStudyCreateAddListProps {
  problemList: ToSolveProblem[];
  addedProblemList: ToSolveProblem[];
  setProblemList: React.Dispatch<React.SetStateAction<ToSolveProblem[]>>;
  setAddedProblemList: React.Dispatch<React.SetStateAction<ToSolveProblem[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.warn,
  color: theme.palette.icon,
}));

function RoomMainStudyCreateAddList({
  problemList,
  addedProblemList,
  setProblemList,
  setAddedProblemList,
}: RoomMainStudyCreateAddListProps) {
  const deleteProblem = (idx: number) => {
    const tempAddedProblem = [...addedProblemList];
    const deletedProblem = tempAddedProblem.splice(idx, 1);
    const newProblemList = [...problemList, ...deletedProblem];

    setProblemList(newProblemList);
    setAddedProblemList(tempAddedProblem);
  };
  return (
    <div>
      <h3>추가된 문제</h3>
      <div>
        {addedProblemList.map((problem, idx) => (
          <CProblem
            key={idx}
            number={problem.number}
            title={problem.title}
            level={problem.level}
            button={
              <CustomIconButton>
                <Remove onClick={() => deleteProblem(idx)} />
              </CustomIconButton>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default RoomMainStudyCreateAddList;
