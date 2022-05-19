import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { alpha, Collapse, IconButton, Stack, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import CBtn from '../../Commons/CBtn';
import CProblem from '../../Commons/CProblem';
import { SolvedMemeberList } from './RoomMainStudyDetail';
import RoomMainStudyDetailUserItem from './RoomMainStudyDetailUserItem';

export interface RoomMainStudyDetailProblemItemProps {
  problemId: number;
  number: number;
  level: number;
  title: string;
  members?: SolvedMemeberList[];
  isSolved?: boolean;
}

function RoomMainStudyDetailProblemItem({
  problemId,
  number,
  title,
  level,
  members,
  isSolved = false,
}: RoomMainStudyDetailProblemItemProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const onClickHandler = () => {
    window.open(`https://www.acmicpc.net/problem/${number}`, '_blank');
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <CProblem
        onClick={() => setOpen((prev) => !prev)}
        borderRadius="10px"
        number={number}
        level={level}
        title={title}
        isSolved={isSolved}
        button={
          <>
            {isMobile || <CBtn onClick={() => navigate(`/compile/${problemId}`)}>코드 제출</CBtn>}
            <IconButton onClick={() => {}} sx={{ width: 'fit-content' }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </>
        }
      />

      <Collapse in={open}>
        {(!members || members?.length === 0) && (
          <Stack
            padding={2}
            spacing={1}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.bg,
              color: alpha(theme.palette.txt, 0.5),
              width: '100%',
              borderRadius: '10px',
              marginTop: '8px',
              display: 'flex',
            }}>
            <div> 저장된 코드가 없습니다.</div>

            <CBtn height="100%" onClick={onClickHandler} backgroundColor="rgba(0,0,0,0)">
              {`문제 보러 가기 >`}
            </CBtn>
            {isMobile || (
              <CBtn height="100%" onClick={onClickHandler} backgroundColor="rgba(0,0,0,0)">
                {`코드 제출하러 가기 >`}
              </CBtn>
            )}
          </Stack>
        )}
        <Stack
          className="scroll-box"
          sx={{ marginTop: 1, borderRadius: '10px', backgroundColor: theme.palette.bg }}>
          {!!members &&
            members.map((member, idx) => (
              <RoomMainStudyDetailUserItem
                key={idx}
                backgroundColor={idx % 2 ? theme.palette.bg : alpha(theme.palette.main, 0.3)}
                problemId={number}
                userId={member.id}
                nickname={member.nickname}
                profileImg={member.profileImg}
              />
            ))}
        </Stack>
      </Collapse>
    </div>
  );
}

export default RoomMainStudyDetailProblemItem;
