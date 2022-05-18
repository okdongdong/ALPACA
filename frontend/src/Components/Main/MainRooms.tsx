import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Pagination, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';
import StudyCreate from '../Dialogs/StudyCreate';
import { styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';

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
  const endRef = useRef<any>();
  const startRef = useRef<any>();
  const userInfo = useSelector((state: any) => state.account);
  const [page, setPage] = useState(1);
  const PER_PAGE = 3;
  const count = Math.ceil(userInfo.studyCount / PER_PAGE);
  const studyList = useSelector((state: any) => state.account.studies);
  const [open, setOpen] = useState(false);
  const handleChange = (e: any, p: number) => {
    setPage(p);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const newData = (newPage: number, newStudyData: any) => {
    setPage(newPage);
  };

  const mNewData = () => {
    endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  const pinData = (firstPage: number) => {
    setPage(firstPage);
  };
  const mPinData = () => {
    startRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  };

  const handleScroll = (): void => {
    const { scrollHeight } = document.documentElement;
    const { scrollTop } = document.documentElement;
    const { clientHeight } = document.documentElement;
    if (isMobile) {
      if (scrollTop >= scrollHeight - clientHeight) {
        setPage(page + 1);
        if (page >= count) setPage(count);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleScroll]);

  return (
    <>
      <BrowserView>
        <Grid container>
          {studyList?.slice((page - 1) * 3, page * 3).map((study: any, i: number) => {
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
          <div ref={startRef} style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
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
            callback={mNewData}
            onClose={() => {
              setOpen(false);
            }}
          />
          {studyList?.slice(0, page * 3).map((study: any, i: number) => {
            return (
              <Stack key={i}>
                <MainRoomsDetail detail={study} page={page} callback={mPinData} />
              </Stack>
            );
          })}
          <div ref={endRef} style={{ height: '7vh' }}></div>
        </Box>
      </MobileView>
    </>
  );
}
export default MainRooms;
