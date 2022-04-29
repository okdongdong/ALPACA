import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CBtn from '../../Commons/CBtn';
import CProblem from '../../Commons/CProblem';
import RoomMainStudyDetailUserItem, {
  RoomMainStudyDetailUserItemProps,
} from './RoomMainStudyDetailUserItem';

export interface RoomMainStudyDetailProblemItemProps {
  problemId: string;
  number: number;
  level: number;
  title: string;
  members?: RoomMainStudyDetailUserItemProps[];
}

function RoomMainStudyDetailProblemItem({
  problemId,
  number,
  title,
  level,
  members,
}: RoomMainStudyDetailProblemItemProps) {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <CProblem
        number={number}
        level={level}
        title={title}
        button={
          <>
            <CBtn onClick={() => navigate(`/compile/${problemId}`)}>문제풀기</CBtn>
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </>
        }
      />

      <Collapse in={open}>
        {!!members &&
          members.map((member, idx) => (
            <RoomMainStudyDetailUserItem
              key={idx}
              problemId={member.problemId}
              userId={member.userId}
              nickname={member.nickname}
              profileImg={member.profileImg}
            />
          ))}
      </Collapse>
    </>
  );
}

export default RoomMainStudyDetailProblemItem;
