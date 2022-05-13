import { useState } from 'react';
import { Box, Grid, Pagination, Stack, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';
import StudyCreate from '../Dialogs/StudyCreate';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { customAxios } from '../../Lib/customAxios';
import { BrowserView, MobileView } from 'react-device-detect';

const CIconButton = styled(IconButton)(({ theme }) => ({
  margin: '10px',
  padding: 2.5,
  borderRadius: '10px',
  background: theme.palette.main,
  height: '165px',
  width: '165px',
}));

const MIconButton = styled(IconButton)(({ theme }) => ({
  display: 'inline-block',
  background: 'none',
  marginLeft: 'auto',
}));

function MainRooms() {
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  const [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const count = Math.ceil(userInfo.studyCount / PER_PAGE);
  const [studyList, setStudyList] = useState<any>(userInfo.studies);
  const [open, setOpen] = useState(false);
  const handleChange = (e: any, p: number) => {
    setPage(p);
    searchData(p);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const newData = (newPage: number, newStudyData: any) => {
    setPage(newPage);
    setStudyList(newStudyData);
  };

  const test = (newPage: number, newStudyData: any) => {
    setStudyList(newStudyData);
  };

  const pinData = (newPage: number, newStudyData: any) => {
    setPage(newPage);
    setStudyList(newStudyData);
  };

  const searchData = async (now: number) => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study`,
        params: { page: now - 1 },
      });
      console.log(res);
      setStudyList(res.data.content);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <BrowserView>
        <Grid container>
          {studyList.slice(0, 3).map((study: any, i: number) => {
            return (
              <Stack key={i}>
                <MainRoomsDetail detail={study} page={page} callback={pinData} />
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
            page={page}
            studyList={studyList}
            callback={newData}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Grid>
        <Pagination
          count={count}
          size="large"
          page={page}
          onChange={handleChange}
          sx={{
            marginTop: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiPagination-ul': {
              '& .MuiPaginationItem-root': {
                color: theme.palette.txt,
                '&.Mui-selected': {
                  background: theme.palette.main,
                  color: theme.palette.txt,
                },
              },
            },
          }}
        />
      </BrowserView>
      <MobileView style={{ width: '100%' }}>
        <Box p="5" sx={{ width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
            <MIconButton onClick={handleClickOpen}>
              <AddIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: theme.palette.txt,
                }}
              />
            </MIconButton>
          </div>
          <StudyCreate
            open={open}
            page={page}
            studyList={studyList}
            callback={test}
            onClose={() => {
              setOpen(false);
            }}
          />
          {studyList.map((study: any, i: number) => {
            return (
              <Stack key={i}>
                <MainRoomsDetail detail={study} page={page} callback={pinData} />
              </Stack>
            );
          })}
        </Box>
      </MobileView>
    </>
  );
}
export default MainRooms;
