import React, { useState } from 'react';
import { Box, Grid, Pagination, Stack } from '@mui/material';
import usePagination from './MainRoomsPagenation';
import PaginationItem from '@mui/material/PaginationItem';

//create
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';
import StudyCreate from '../Dialogs/StudyCreate';

function MainRooms() {
  let [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const [data, setData] = useState<any[]>([]);
  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const addStudyData = (studyData: any) => {
    setData((data) => {
      return [...data, studyData];
    });
  };

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box p="5">
      <Grid container spacing={2} direction="row">
        {_DATA.currentData().map((study, i) => {
          console.log(study);
          return (
            <Stack key={i}>
              <MainRoomsDetail detail={study} />
            </Stack>
          );
        })}
        <IconButton
          sx={{
            mx: '10px',
            my: '10px',
            px: 2.5,
            borderRadius: '10px',
            background: '#97B2E1',
            height: '200px',
            width: '200px',
            '&:hover': {
              background: '#97B2E1' + '90',
            },
          }}
          onClick={handleClickOpen}>
          <AddIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: '#FFFFFF',
              height: '100px',
              width: '100px',
            }}
          />
        </IconButton>
        <StudyCreate
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          callback={addStudyData}
        />
      </Grid>
      <Pagination
        count={count}
        size="large"
        page={page}
        onChange={handleChange}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />
    </Box>
  );
}
export default MainRooms;
