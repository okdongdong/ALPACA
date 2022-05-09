import { Add } from '@mui/icons-material';
import { alpha, Collapse, IconButton, styled, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { solvedAcAxios } from '../../../Lib/customAxios';
import { Member, setProblemListRes } from '../../../Redux/roomReducer';
import CProblem from '../../Commons/CProblem';
import CSearchBar from '../../Commons/CSearchBar';
import RoomMainStudyCreateSearchFilter from './RoomMainStudyCreateSearchFilter';
import { ProblemRes } from './RoomMainStudyDetail';

interface RoomMainStudyCreateSearchProps {
  problemList: ProblemRes[];
  setProblemList: React.Dispatch<React.SetStateAction<ProblemRes[]>>;
}

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
  width: 30,
  height: 30,
  marginRight: theme.spacing(2),
}));

const FilterBox = styled(Collapse)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderRadius: 10,
  backgroundColor: theme.palette.bg,
}));

const ProblemBox = styled('div')(({ theme }) => ({
  height: '20vh',
  borderRadius: 10,
  backgroundColor: theme.palette.bg,
}));

function RoomMainStudyCreateSearch({
  problemList,
  setProblemList,
}: RoomMainStudyCreateSearchProps) {
  const theme = useTheme();

  const dispatch = useDispatch();
  const problemListRes = useSelector((state: any) => state.room.problemListRes);
  const members = useSelector((state: any) => state.room.members);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [tierValue, setTierValue] = useState<number>(0);

  const addProblem = (idx: number) => {
    const tempProblemList = [...problemList];
    const addedProblem = tempProblemList.splice(idx, 1);
    const newAddedProblemList = [...problemListRes, ...addedProblem];

    setProblemList(tempProblemList);
    dispatch(setProblemListRes(newAddedProblemList));
  };

  // solvedAC api를 사용해 문제 검색
  const searchProblem = async () => {
    let query = '';
    query += searchQuery;
    members.forEach((member: Member) => {
      if (member?.isQuery) query += ` !@${member.nickname}`;
    });
    if (tierValue > 0) query += ` *${tierValue}..${tierValue + 4}`;

    console.log(query);
    try {
      const res = await solvedAcAxios({
        method: 'get',
        url: '/search/problem',
        params: { query },
      });
      console.log(res);

      const resProblems: ProblemRes[] = [];

      res.data.items.forEach((item: any) => {
        // 이미 추가되지 않은 문제만 출력해줌
        if (
          !problemListRes.some(
            (problem: ProblemRes) => problem.problemNumber === item.problemNumber,
          )
        ) {
          resProblems.push({
            problemNumber: item.problemId,
            title: item.titleKo,
            level: item.level,
          });
        }
      });
      setProblemList(resProblems);
    } catch (e: any) {
      console.log(e.response);
    }
  };

  const onFilterHandler = () => {
    setIsFilter((prev) => !prev);
  };

  return (
    <div style={{ height: '50%' }}>
      <CSearchBar
        onChange={setSearchQuery}
        onSearch={searchProblem}
        filter
        filterOn={isFilter}
        onFilter={onFilterHandler}
        placeholder="문제를 검색해서 추가할 수 있습니다."
      />
      <FilterBox in={isFilter}>
        <RoomMainStudyCreateSearchFilter tierValue={tierValue} setTierValue={setTierValue} />
      </FilterBox>

      <ProblemBox className="scroll-box">
        {problemList.map((problem: ProblemRes, idx: number) => (
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
