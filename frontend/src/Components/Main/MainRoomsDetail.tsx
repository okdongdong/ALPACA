import { Avatar, Button, Grid, IconButton, styled, useTheme } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import styles from './MainRoomsDetail.module.css';
import alpaca from '../../Assets/Img/alpaca.png';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setStudies } from '../../Redux/accountReducer';
import { useNavigate } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import CProfile from '../Commons/CProfile';

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
  width: '400px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  marginLeft: '35px',
}));

const CButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'start',
  paddingTop: '25px',
  background: theme.palette.main,
  height: '150px',
  width: '150px',
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStudy = useSelector((state: any) => state.account.studies);

  const pinStudy = async () => {
    var findStudy = userStudy.findIndex((v: any) => v.id === props.detail.id);
    try {
      await customAxios({
        method: 'post',
        url: `/study/${props.detail.id}/pin`,
      });
      const temp = [...userStudy];
      let deleteTemp = temp.splice(findStudy, 1);
      const tmp = { ...deleteTemp[0] };
      if (tmp.pinnedTime.split('-')[0] === '0001') {
        tmp.pinnedTime = new Date().toISOString();
        temp.unshift(tmp);
        props.callback(1);
      } else {
        tmp.pinnedTime = '0001-01-01T06:00:00';
        var minId = 101;
        temp.forEach((item: any, index: number) => {
          if (item.pinnedTime.split('-')[0] === '0001') {
            if (item.id > tmp.id) {
              minId = Math.min(item.id, minId);
              return minId;
            }
          }
        });
        if (minId === 101) {
          temp.push(tmp);
        } else {
          var findIdx = userStudy.findIndex((v: any) => v.id === minId);
          temp.splice(findIdx - 1, 0, tmp);
        }
      }
      dispatch(setStudies(temp));
    } catch (e) {
      console.log(e);
    }
  };

  const goStudy = () => {
    navigate(`/room/${props.detail.id}`);
  };

  return (
    <>
      <BrowserView>
        <div style={{ position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 6,
              left: 'calc(50% - 70px)',
              color:
                props.detail.pinnedTime.split('-')[0] === '0001' || props.detail.pinnedTime === null
                  ? theme.palette.bg
                  : theme.palette.component_accent,
              margin: 0,
              padding: 0,
              height: '25px',
              width: '25px',
              zIndex: 1,
              '&:hover': {
                color: theme.palette.accent,
              },
            }}
            onClick={pinStudy}>
            <PushPinIcon />
          </IconButton>

          <CButton onClick={goStudy} sx={{ my: 1 }}>
            <Grid container alignItems="start" spacing={1} sx={{ paddingBottom: 1 }}>
              {props.detail.profileImgList.slice(0, 4).map((profileImg: string, i: number) => (
                <Grid item xs={6} key={i}>
                  <div className="align_center">
                    <Avatar
                      src={profileImg || alpaca}
                      alt="profileImg"
                      sx={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'rgba(123,123,123,0.5)',
                      }}
                    />
                  </div>
                </Grid>
              ))}
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
                props.detail.pinnedTime.split('-')[0] === '0001' || props.detail.pinnedTime === null
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
