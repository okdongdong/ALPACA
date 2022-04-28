import React, { useState } from 'react';
import RoomStudyLiveCamListItem from './RoomStudyLiveCamListItem';
import RoomStudyLiveCodeEditer from './RoomStudyLiveCodeEditer';
import { styled, useTheme } from '@mui/material/styles';
import UserModel from './user-model';
import { DragHandle } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type mainPropsType = {
  mainStreamManager: UserModel;
  openYjsDocs: Boolean;
  setOpenYjsDocs: Function;
};

const CustomDragHandle = styled(DragHandle)(({ theme }) => ({
  cursor: 'col-resize',
  transform: 'rotate(90deg)',
  color: theme.palette.main,
}));

function RoomStudyLiveMain({ mainStreamManager, openYjsDocs, setOpenYjsDocs }: mainPropsType) {
  const theme = useTheme();
  const [width, setWidth] = useState<string>('20vw');
  const handleDrag = (e: React.DragEvent) => {
    // 1920 기준 500
    console.log(e.currentTarget?.parentElement?.getBoundingClientRect());
    const innerWidth = e.currentTarget.parentElement?.getBoundingClientRect().right;
    if (innerWidth && window.innerWidth * 0.95 > e.clientX && e.clientX > 500) {
      setWidth(`${innerWidth - e.clientX}px`);
    }
  };
  return (
    <>
      <div
        style={{
          background: theme.palette.component,
          width: openYjsDocs ? `calc(100% - ${width} - 10px)` : '',
          height: '200px',
        }}>
        {mainStreamManager && <RoomStudyLiveCamListItem user={mainStreamManager} />}
      </div>

      <div style={{ height: '100%', width: openYjsDocs ? width : '2vw' }} className="align_center">
        {openYjsDocs && (
          <IconButton draggable size="small" onDrag={handleDrag}>
            <CustomDragHandle />
          </IconButton>
        )}
        <RoomStudyLiveCodeEditer
          width={width}
          openYjsDocs={openYjsDocs}
          setOpenYjsDocs={setOpenYjsDocs}
        />
      </div>
    </>
  );
}

export default RoomStudyLiveMain;
