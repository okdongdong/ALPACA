import React, { useState } from 'react';
import { Box, Grid, Pagination, Stack } from '@mui/material';
import usePagination from './MainRoomsPagenation';
import PaginationItem from '@mui/material/PaginationItem';

//create
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';

function MainRooms() {
  let [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7]);
  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  //create
  const onAddDetailDiv = () => {
    let datalist = [...data];
    let counter = datalist.slice(-1)[0];

    // 나중에 여기를 스터디이름으로 변경
    counter += 1;
    datalist.push(counter);
    setData(datalist);
  };

  return (
    <Box p="5">
      <Grid container spacing={2} direction="row">
        {_DATA.currentData().map((item, i) => {
          return (
            <Stack key={i}>
              <MainRoomsDetail detail={item} />
            </Stack>
          );
        })}
        <IconButton
          aria-label="EditIcon"
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
          onClick={onAddDetailDiv}>
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
