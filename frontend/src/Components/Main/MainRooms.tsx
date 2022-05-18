import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Pagination, Stack, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainRoomsDetail from './MainRoomsDetail';
import StudyCreate from '../Dialogs/StudyCreate';
import { styled, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { customAxios } from '../../Lib/customAxios';
import useAlert from '../../Hooks/useAlert';
import { setStudies } from '../../Redux/accountReducer';

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

const PER_PAGE = 4;

function MainRooms() {
  const theme = useTheme();
  const cAlert = useAlert();
  const dispatch = useDispatch();
  const endRef = useRef<any>();
  const startRef = useRef<any>();

  const studies = useSelector((state: any) => state.account.studies);
  const profileImg = useSelector((state: any) => state.account.profileImg);

  const [page, setPage] = useState(1);
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

  const getStudiesInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: '/study',
      });
      dispatch(setStudies(res.data));

      console.log('getStudiesInfo: ', res);
    } catch (e: any) {
      console.log(e.response);
      cAlert.fire({
        title: '스터디 조회 실패!',
        text: e.response.data.message || '스터디 정보를 불러오는데 실패했습니다..',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    getStudiesInfo();
  }, [profileImg]);

  return (
    <>
      <BrowserView>
        <Grid container>
          {studies?.slice((page - 1) * 4, page * 4).map((study: any, i: number) => {
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
            studyList={studies}
            callback={newData}
            onClose={() => {
              setOpen(false);
            }}
          />
        </Grid>
        <Pagination
          count={Math.ceil(studies.length / PER_PAGE)}
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
            studyList={studies}
            callback={mNewData}
            onClose={() => {
              setOpen(false);
            }}
          />
          {studies?.slice(0, page * 3).map((study: any, i: number) => {
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
