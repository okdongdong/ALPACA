import { Divider, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { customAxios } from '../../../Lib/customAxios';
import CBtn from '../../Commons/CBtn';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainStudyCreateAddList from './RoomMainStudyCreateAddList';
import RoomMainStudyCreateSearch from './RoomMainStudyCreateSearch';
import RoomMainStudyCreateTime from './RoomMainStudyCreateTime';
import { ToSolveProblem } from './RoomMainStudyDetail';

interface RoomMainStudyCreateProps {
  selectedDay: Date;
}

interface AddStudyData {
  startedAt: Date;
  finishedAt: Date;
  studyId: string;
  toSolveProblems: string[];
}

function RoomMainStudyCreate({ selectedDay }: RoomMainStudyCreateProps) {
  const { roomId } = useParams();

  const [problemList, setProblemList] = useState<ToSolveProblem[]>([]);
  const [addedProblemList, setAddedProblemList] = useState<ToSolveProblem[]>([]);
  const [startedAt, setStartedAt] = useState<Date | null>(selectedDay);
  const [finishedAt, setFinishedAt] = useState<Date | null>(selectedDay);

  const addStudy = async () => {
    try {
      const data: AddStudyData = {
        startedAt: startedAt || selectedDay,
        finishedAt: finishedAt || selectedDay,
        studyId: roomId || '',
        toSolveProblems: [],
      };

      console.log(data);

      addedProblemList.map((problem) => {
        data.toSolveProblems.push(problem.id);
      });

      const res = await customAxios({
        method: 'post',
        url: '/schedule',
        data: data,
      });

      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const onClickHandler = () => {
    addStudy();
  };

  return (
    <RoomMainComponentContainer>
      <Stack sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <h1 style={{ textAlign: 'center' }}>스터디 일정추가</h1>
        <RoomMainStudyCreateTime
          selectedDay={selectedDay}
          startedAt={startedAt}
          setStartedAt={setStartedAt}
          finishedAt={finishedAt}
          setFinishedAt={setFinishedAt}
        />

        <RoomMainStudyCreateSearch
          problemList={problemList}
          setProblemList={setProblemList}
          addedProblemList={addedProblemList}
          setAddedProblemList={setAddedProblemList}
        />
        <Divider variant="middle" />
        <RoomMainStudyCreateAddList
          problemList={problemList}
          setProblemList={setProblemList}
          addedProblemList={addedProblemList}
          setAddedProblemList={setAddedProblemList}
        />
        <CBtn width="30%" onClick={onClickHandler}>
          스터디등록
        </CBtn>
      </Stack>
    </RoomMainComponentContainer>
  );
}

export default RoomMainStudyCreate;
