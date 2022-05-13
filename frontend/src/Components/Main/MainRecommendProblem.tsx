import React, { useEffect, useState } from 'react';
import { customAxios } from '../../Lib/customAxios';
import { Paper, useTheme, styled, Button, IconButton } from '@mui/material';
import { Check, Link } from '@mui/icons-material';
import CClassBadge from '../Commons/CClassBadge';
import CBadge from '../Commons/CBadge';
import { useNavigate } from 'react-router-dom';

type RecommendProblemType = {
  classLevel: number;
  level: number;
  problemNumber: number;
  title: string;
  isSolved: boolean;
};

const CustomBtn = styled(Button)(({ theme }) => ({
  fontFamily: 'Pretendard-Regular',
  borderRadius: '20px',
  background: theme.palette.bg,
  color: theme.palette.txt,
  '&:hover': {
    background: theme.palette.bg + '90',
  },
}));

const RecommendProblemDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '23vh',
  marginTop: '2vh',
  marginBottom: '3vh',
  borderRadius: '10px',
  padding: '10px',
  color: theme.palette.txt,
  background: theme.palette.component,
}));
function RecommendProblem(props: { problem: RecommendProblemType }) {
  const { classLevel, level, problemNumber, title, isSolved } = props.problem;
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <div
      className="align_column_center"
      style={{
        maxWidth: '100%',
        position: 'relative',
        borderRadius: '10px',
        height: '100%',
        width: '100%',
        background: theme.palette.main,
      }}>
      <CClassBadge width={30} height={30} level={classLevel} />
      <div
        onClick={() => {
          window.open(`https://www.acmicpc.net/problem/${problemNumber}`, '_blank');
        }}
        className="align_center"
        style={{ marginTop: '0.8vh', marginBottom: '1.6vh', cursor: 'pointer' }}>
        <CBadge tier={level} />
        <div style={{ marginLeft: '0.5vw' }}>{problemNumber}</div>
        <IconButton>
          <Link sx={{ color: theme.palette.txt }} />
        </IconButton>
      </div>
      <div style={{ height: '5vh', overflowY: 'auto' }}>{title}</div>
      <CustomBtn
        size="small"
        onClick={() => {
          navigate(`/compile/${problemNumber}`);
        }}>
        풀기
      </CustomBtn>
      {isSolved && (
        <div
          className="align_center"
          style={{
            borderRadius: '10px',
            height: '100%',
            width: '100%',
            position: 'absolute',
            background: theme.palette.component_accent + '90',
            color: theme.palette.icon,
          }}>
          <Check style={{ height: '60%', width: '60%' }} />
        </div>
      )}
    </div>
  );
}

function MainRecommendProblem() {
  const theme = useTheme();
  const [recommendProblems, setRecommendProblems] = useState<RecommendProblemType[]>([]);

  const getRecommendProblem = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: '/problem/recommend',
      });
      console.log(res);
      setRecommendProblems(
        res.data.map((problem: any) => {
          return {
            classLevel: problem.classLevel,
            level: problem.level,
            problemNumber: problem.problemNumber,
            title: problem.title,
            isSolved: problem.isSolved,
          };
        }),
      );
    } catch (e) {}
  };

  useEffect(() => {
    getRecommendProblem();
  }, []);
  return (
    <RecommendProblemDiv>
      <div style={{ textAlign: 'center', height: '3vh', fontWeight: '600', fontSize: '1.2rem' }}>
        오늘의 추천문제
      </div>
      <div style={{ height: '18.5vh', display: 'flex', justifyContent: 'space-around' }}>
        {recommendProblems.map((problem) => {
          return (
            <div
              key={problem.problemNumber}
              style={{
                width: `calc(90% / ${
                  recommendProblems.length === 0 ? 1 : recommendProblems.length
                })`,
                height: '100%',
              }}>
              <RecommendProblem problem={problem} />
            </div>
          );
        })}
      </div>
    </RecommendProblemDiv>
  );
}

export default MainRecommendProblem;
