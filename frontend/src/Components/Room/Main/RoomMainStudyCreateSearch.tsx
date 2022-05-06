import { Add } from '@mui/icons-material';
import { alpha, IconButton, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { customAxios, solvedAcAxios } from '../../../Lib/customAxios';
import CProblem from '../../Commons/CProblem';
import CSearchBar from '../../Commons/CSearchBar';
import { ProblemRes } from './RoomMainStudyDetail';

interface RoomMainStudyCreateSearchProps {
  problemList: ProblemRes[];
  addedProblemList: ProblemRes[];
  setProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
  setAddedProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.accent,
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

function RoomMainStudyCreateSearch({
  problemList,
  addedProblemList,
  setProblemList,
  setAddedProblemList,
}: RoomMainStudyCreateSearchProps) {
  const theme = useTheme();
  const [query, setQuery] = useState<string>('');

  const addProblem = (idx: number) => {
    const tempProblemList = [...problemList];
    const addedProblem = tempProblemList.splice(idx, 1);
    const newAddedProblemList = [...addedProblemList, ...addedProblem];

    setProblemList(tempProblemList);
    setAddedProblemList(newAddedProblemList);
  };

  const searchProblem = async () => {
    // const res = await customAxios({
    //   method: 'get',
    //   url: '/problem',
    //   params: { problemNumber: query },
    // });

    const res = await solvedAcAxios({
      method: 'get',
      url: '/search/problem',
      params: { query },
    });
    console.log(res);

    const resProblems: ProblemRes[] = [];

    res.data.items.map((item: any) => {
      // 이미 추가되지 않은 문제만 출력해줌
      if (!addedProblemList.some((problem) => problem.problemNumber === item.problemNumber)) {
        resProblems.push({
          problemNumber: item.problemNumber,
          title: item.titleKo,
          level: item.level,
        });
      }
    });

    setProblemList(resProblems);
  };

  return (
    <div style={{ height: '50%' }}>
      <CSearchBar
        onChange={setQuery}
        onSearch={searchProblem}
        placeholder="문제를 검색해서 추가할 수 있습니다."
      />
      <ProblemBox className="scroll-box">
        {problemList.map((problem, idx) => (
          <CProblem
            key={idx}
            number={problem.problemNumber}
            backgroundColor={idx % 2 ? '' : alpha(theme.palette.main, 0.3)}
            title={problem.title}
            level={problem.level}
            button={
              <CustomIconButton>
                <Add onClick={() => addProblem(idx)} />
              </CustomIconButton>
            }
          />
        ))}
      </ProblemBox>
    </div>
  );
}

export default RoomMainStudyCreateSearch;
