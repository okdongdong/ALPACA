import React, { useState } from 'react';
import { customAxios } from '../../../Lib/customAxios';
import CBtn from '../../Commons/CBtn';
import CProblem from '../../Commons/CProblem';
import { styled, useTheme, Popover, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

type LiveAppbarType = {
  exitStudyLive: Function;
};
type problemInfoType = {
  level: number;
  problemNumber: number;
  title: string;
};

const PopoverPaper = styled('div')(({ theme }) => ({
  background: theme.palette.component,
  padding: '10px',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Pretendard-Regular',
  borderRadius: '10px',
  minWidth: 'fit-content',
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
  '&:hover': {
    backgroundColor: theme.palette.main + '90',
  },
}));

function RoomStudyLiveAppbar({ exitStudyLive }: LiveAppbarType) {
  const { roomId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [problemList, setProblemList] = useState<problemInfoType[]>();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    getTodayProblem();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getTodayProblem = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `schedule/${roomId}/today`,
        params: {
          offset: new Date().getTimezoneOffset(),
        },
      });
      setProblemList(
        res.data.problemListRes.map((problem: any) => {
          return {
            level: problem.level,
            problemNumber: problem.problemNumber,
            title: problem.title,
          };
        }),
      );
    } catch (e) {}
  };

  return (
    <div>
      <span style={{ marginRight: '1rem' }}>
        <CustomButton onClick={handleOpen}>오늘의 스터디 문제</CustomButton>
      </span>
      <span>
        <CBtn width="4vw" onClick={() => exitStudyLive()} backgroundColor={theme.palette.warn}>
          퇴장
        </CBtn>
      </span>
      <Popover
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}>
        <PopoverPaper>
          {problemList ? (
            problemList?.map((problem, index) => {
              return (
                <div style={{ margin: '13px 10px 13px 10px' }} key={index}>
                  <CProblem
                    level={problem.level}
                    title={problem.title}
                    number={problem.problemNumber}
                    borderRadius="10px"
                    button={
                      <CustomButton
                        onClick={() => {
                          navigate(`/compile/${problem.problemNumber}`);
                        }}>
                        컴파일
                      </CustomButton>
                    }
                  />
                </div>
              );
            })
          ) : (
            <div
              style={{
                height: '10vh',
                width: '10vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.txt,
              }}>
              오늘의 문제가 없습니다.
            </div>
          )}
        </PopoverPaper>
      </Popover>
    </div>
  );
}

export default RoomStudyLiveAppbar;
