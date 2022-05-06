import React from 'react';
import { Link } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CBadge from '../../Commons/CBadge';
type propsType = {
  problemId: number;
  problemTitle: string;
  tier: number;
};

function RoomCompileTitle({ tier, problemId, problemTitle }: propsType) {
  const goToProblem = () => {
    window.open(`https://www.acmicpc.net/problem/${problemId}`, '_blank');
  };
  return (
    <div style={{ fontSize: '1.3rem', padding: '0.7rem', display: 'flex', alignItems: 'center' }}>
      <CBadge tier={tier} />
      <span style={{ marginRight: '1rem', marginLeft: '1rem' }}>
        {problemId} - {problemTitle}
      </span>
      <IconButton onClick={goToProblem}>
        <Link />
      </IconButton>
    </div>
  );
}

export default RoomCompileTitle;
