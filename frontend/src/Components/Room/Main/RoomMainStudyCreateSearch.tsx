import { Add } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import React, { useState } from 'react';
import { solvedAcAxios } from '../../../Lib/customAxios';
import CProblem from '../../Commons/CProblem';
import CSearchBar from '../../Commons/CSearchBar';
import { ToSolveProblem } from './RoomMainStudyDetail';

interface RoomMainStudyCreateSearchProps {
  problemList: ToSolveProblem[];
  addedProblemList: ToSolveProblem[];
  setProblemList: React.Dispatch<React.SetStateAction<ToSolveProblem[]>>;
  setAddedProblemList: React.Dispatch<React.SetStateAction<ToSolveProblem[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
}));

function RoomMainStudyCreateSearch({
  problemList,
  addedProblemList,
  setProblemList,
  setAddedProblemList,
}: RoomMainStudyCreateSearchProps) {
  const [query, setQuery] = useState<string>('');

  const addProblem = (idx: number) => {
    const tempProblemList = [...problemList];
    const addedProblem = tempProblemList.splice(idx, 1);
    const newAddedProblemList = [...addedProblemList, ...addedProblem];

    setProblemList(tempProblemList);
    setAddedProblemList(newAddedProblemList);
  };

  const searchProblem = async () => {
    const res = await solvedAcAxios({
      method: 'get',
      url: '/search/problem',
      params: { query },
    });
    console.log(res);

    const resProblems: ToSolveProblem[] = [];

    res.data.items.map((item: any) => {
      // 이미 추가되지 않은 문제만 출력해줌
      if (!addedProblemList.some((problem) => problem.id === item.id)) {
        resProblems.push({
          id: item.id,
          number: item.number,
          title: item.titleKo,
          level: item.level,
        });
      }
    });

    setProblemList(resProblems);
  };

  return (
    <div>
      <CSearchBar onChange={setQuery} onSearch={searchProblem} />
      <div>
        {problemList.map((problem, idx) => (
          <CProblem
            key={idx}
            number={problem.number}
            title={problem.title}
            level={problem.level}
            button={
              <CustomIconButton>
                <Add onClick={() => addProblem(idx)} />
              </CustomIconButton>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default RoomMainStudyCreateSearch;
