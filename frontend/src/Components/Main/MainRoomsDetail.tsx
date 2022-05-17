import { Button, Grid } from '@mui/material';
import styles from './MainRoomsDetail.module.css';
import PushPinIcon from '@mui/icons-material/PushPin';
import alpaca from '../../Assets/Img/alpaca.png';
import { styled, useTheme } from '@mui/material/styles';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import { useNavigate } from 'react-router-dom';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import useAlert from '../../Hooks/useAlert';

export interface StudyCreateProps {
  detail: any;
  page: number;
  callback: Function;
}

const NameLabel = styled('div')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}));

const MNameLabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'left',
  width: '200px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  marginLeft: '35px',
}));

const CButton = styled(Button)(({ theme }) => ({
  minHeight: 48,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  borderRadius: '10px',
  background: theme.palette.main,
  height: '165px',
  width: '165px',
  position: 'relative',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));
const MButton = styled(Button)(({ theme }) => ({
  minHeight: 48,
  background: theme.palette.main,
  height: '6vh',
  width: '100%',
  position: 'relative',
  '&:hover': {
    background: theme.palette.main + '90',
  },
  marginBottom: '3px',
}));

function MainRoomsDetail(props: StudyCreateProps) {
  const theme = useTheme();
  const cAlert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.account);

  const pinStudy = async () => {
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study/${props.detail.id}/pin`,
        data: { limit: props.page * 3 },
      });
      console.log(res);
      if (isMobile) {
        if (res.data !== '') {
          console.log('!=null');
          const temp = { ...userInfo };
          temp.studies = res.data;
          dispatch(setUserInfo(temp));
          props.callback(1, res.data);
          return;
        }
        if (res.data === '') {
          console.log('==null');
          const temp = { ...userInfo };

          const popItem = temp.studies.pop(
            temp.studies.findIndex((v: any) => v.id === props.detail.id),
          );
          console.log(popItem);
          temp.studies.unshift(popItem);
          dispatch(setUserInfo(temp));
          props.callback(1, temp.studies);
          return;
        }
      }
      pinCheckOn();
    } catch (e) {
      console.log(e);
    }
  };

  const pinCheckOn = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study`,
        params: { page: 0 },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.studies = res.data.content;
      dispatch(setUserInfo(resUserInfo));
      props.callback(1, res.data.content);
    } catch (e) {
      console.log(e);
    }
  };

  const goStudy = () => {
    cAlert
      .fire({
        title: '스터디 입장',
        text: '스터디에 입장 하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          navigate(`/room/${props.detail.id}`);
        }
      });
  };

  return (
    <>
      <BrowserView>
        <div style={{ position: 'relative' }}>
          <PushPinIcon
            sx={{
              position: 'absolute',
              top: 6,
              left: 12,
              color:
                props.detail.pinnedTime === '0001-01-01T06:00:00' ||
                props.detail.pinnedTime === null
                  ? theme.palette.bg
                  : theme.palette.component_accent,
              margin: 0,
              padding: 0,
              height: '25px',
              width: '25px',
              zIndex: 1,
            }}
            onClick={pinStudy}></PushPinIcon>
          <CButton onClick={goStudy}>
            <Grid container sx={{ padding: 2 }}>
              {props.detail.profileImgList.slice(0, 4).map((item: string, i: number) => {
                return (
                  <Grid item xs={6} key={i} sx={{ padding: 0 }}>
                    <img src={!!item ? item : alpaca} className={styles.profileimg_mini} alt="" />
                  </Grid>
                );
              })}
            </Grid>
          </CButton>
          <NameLabel sx={{ px: '8px' }}>{props.detail.title}</NameLabel>
        </div>
      </BrowserView>
      <MobileView>
        <div style={{ position: 'relative' }}>
          <PushPinIcon
            sx={{
              position: 'absolute',
              top: 10,
              left: 5,
              color:
                props.detail.pinnedTime === '0001-01-01T06:00:00' ||
                props.detail.pinnedTime === null
                  ? theme.palette.bg
                  : theme.palette.component_accent,
              margin: 0,
              padding: 0,
              height: '25px',
              width: '25px',
              zIndex: 1,
            }}
            onClick={pinStudy}></PushPinIcon>
          <MButton onClick={goStudy}>
            <MNameLabel>{props.detail.title}</MNameLabel>
            <Grid container sx={{ padding: 2 }}>
              {props.detail.profileImgList.slice(0, 4).map((item: string, i: number) => {
                return (
                  <img
                    key={i}
                    src={!!item ? item : alpaca}
                    className={styles.profileimg_mini}
                    alt=""
                    style={{ height: '5vh', width: '5vh' }}
                  />
                );
              })}
            </Grid>
          </MButton>
        </div>
      </MobileView>
    </>
  );
}

export default MainRoomsDetail;
