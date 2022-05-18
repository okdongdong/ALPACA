import React, { useEffect, useState } from 'react';
import { customAxios } from '../../Lib/customAxios';
import { Paper, useTheme, styled, Button, IconButton, Tooltip } from '@mui/material';
import { Check, Link, InfoOutlined } from '@mui/icons-material';
import CClassBadge from '../Commons/CClassBadge';
import CBadge from '../Commons/CBadge';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

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
  height: isMobile ? '' : '20vh',
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
      <CClassBadge width={25} height={25} level={classLevel} />
      <div
        onClick={() => {
          window.open(`https://www.acmicpc.net/problem/${problemNumber}`, '_blank');
        }}
        className="align_center"
        style={{ cursor: 'pointer' }}>
        <CBadge tier={level} width={20} height={20} />
        <div style={{ marginLeft: '0.5vw', fontSize: '0.9rem' }}>{problemNumber}</div>
        <IconButton size="small">
          <Link sx={{ color: theme.palette.txt }} />
        </IconButton>
      </div>
      <div
        style={{
          height: isMobile ? '' : '4vh',
          overflowY: 'auto',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}>
        {title}
      </div>
      {!isMobile && (
        <CustomBtn
          size="small"
          onClick={() => {
            navigate(`/compile/${problemNumber}`);
          }}>
          풀기
        </CustomBtn>
      )}
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
    } catch (e: any) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    getRecommendProblem();
  }, []);
  return (
    <RecommendProblemDiv>
      <div
        style={{
          textAlign: 'center',
          height: '3vh',
          fontWeight: '600',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <span>오늘의 추천문제</span>
        <Tooltip title="본인이 속한 클래스를 기준으로 문제가 추천됩니다." arrow>
          <InfoOutlined fontSize="small" />
        </Tooltip>
      </div>
      <div style={{ height: '15vh', display: 'flex', justifyContent: 'space-around' }}>
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
