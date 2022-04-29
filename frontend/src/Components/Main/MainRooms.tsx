import React, { useState } from 'react';
import { Box, Grid, Pagination, Stack, IconButton } from '@mui/material';
import usePagination from './MainRoomsPagenation';
import PaginationItem from '@mui/material/PaginationItem';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';
import StudyCreate from '../Dialogs/StudyCreate';
import { styled } from '@mui/material/styles';

const CIconButton = styled(IconButton)(({ theme }) => ({
  margin: '10px',
  padding: 2.5,
  borderRadius: '10px',
  background: theme.palette.main,
  height: '200px',
  width: '200px',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

function MainRooms() {
  let [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const [data, setData] = useState<any[]>([]);
  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);
  const handleChange = (e: any, p: any) => {
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
        {_DATA.currentData().map((study: any, i: number) => {
          console.log(study);
          return (
            <Stack key={i}>
              <MainRoomsDetail detail={study} />
            </Stack>
          );
        })}
        <CIconButton onClick={handleClickOpen}>
          <AddIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: '#FFFFFF',
              height: '100px',
              width: '100px',
            }}
          />
        </CIconButton>
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
