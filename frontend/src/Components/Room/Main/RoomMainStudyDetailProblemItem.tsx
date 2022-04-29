import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { alpha, Collapse, IconButton, Stack, useTheme } from '@mui/material';
import React, { useState } from 'react';
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
}

function RoomMainStudyDetailProblemItem({
  problemId,
  number,
  title,
  level,
  members,
}: RoomMainStudyDetailProblemItemProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div style={{ marginTop: '8px' }}>
      <CProblem
        borderRadius="10px"
        number={number}
        level={level}
        title={title}
        button={
          <>
            <CBtn onClick={() => navigate(`/compile/${problemId}`)}>문제풀기</CBtn>
            <IconButton onClick={() => setOpen((prev) => !prev)} sx={{ width: 'fit-content' }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </>
        }
      />

      <Collapse in={open}>
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
