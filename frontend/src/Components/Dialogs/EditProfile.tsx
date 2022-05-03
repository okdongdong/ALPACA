import React, { useRef, useState } from 'react';
import { Dialog, Button, Grid, MenuItem, FormControl, Box, Input } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../Redux/themeReducer';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import { logout } from '../../Redux/accountReducer';
import EditPassword from './EditPassword';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../Main/MainIntroductionProfile.module.css';
import Basic from '../../Assets/Img/Basic.png';
import Dark from '../../Assets/Img/Dark.png';
import Olivegreen from '../../Assets/Img/Olivegreen.png';
import Peachpink from '../../Assets/Img/Peachpink.png';

const WButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.warn,
  color: theme.palette.txt,
}));

const ProfileSearch = styled('input')({
  display: 'none',
});

const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
}));
const TInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const CSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 960,
  minHeight: 720,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

const ThemeButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 0,
  padding: 10,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const CButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

export interface EditProfileProps {
  open: boolean;
  onClose: () => void;
}

function EditProfile({ onClose, open }: EditProfileProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userTheme = useSelector((state: any) => state.theme.themeType);
  const userInfo = useSelector((state: any) => state.account);
  const [stacks, setStacks] = React.useState(userInfo.preferredLanguage);
  const [nickname, setNickname] = useState<string>(userInfo.nickname);
  const [introduction, setIntroduction] = useState<string>(userInfo.info);
  const [imgData, setImgData] = useState<any>();
  const [themeSelect, setThemeSelect] = useState(userTheme);
  const [openEditPassword, setOpenEditPassword] = useState(false);

  const cancleClose = () => {
    onClose();
    setThemeSelect(userTheme);
  };

  const editDataClose = () => {
    editUserData();
    onClose();
  };

  const dialogOpen = () => {
    setOpenEditPassword(true);
  };
  const dialogClose = () => {
    setOpenEditPassword(false);
  };

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === 'string') {
      setStacks(event.target.value);
    }
  };

  const inputNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };
  const inputIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduction(event.target.value);
  };

  const editProfileImg = async (profileData: string) => {
    console.log(profileData);
    console.log(frm.get('file'));
    try {
      await customAxios({
        method: 'post',
        url: `/user/${userInfo.userId}/profile`,
        data: frm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.profileImg = profileData;
      dispatch(setUserInfo(resUserInfo));
    } catch (e) {
      console.log(e);
    }
  };

  const imgRef = useRef<HTMLInputElement>(null);
  const frm = new FormData();
  const reader = new FileReader();
  const imageChange = (event: any) => {
    const files = event.target.files[0];
    frm.append('file', event.target.files[0]);
    reader.readAsDataURL(files);
    reader.onloadend = () => {
      setImgData(reader.result);
      if (typeof reader.result === 'string') {
        editProfileImg(reader.result);
      }
    };
  };

  const editUserData = async () => {
    try {
      await customAxios({
        method: 'put',
        url: `/user/${userInfo.userId}`,
        data: {
          info: introduction,
          nickname: nickname,
          preferredLanguage: stacks,
          theme: themeSelect,
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.nickname = nickname;
      resUserInfo.info = introduction;
      resUserInfo.preferredLanguage = stacks;
      console.log('수정 테마', themeSelect);
      dispatch(setTheme(themeSelect));
      dispatch(setUserInfo(resUserInfo));
    } catch (e) {
      console.log(e);
    }
  };

  const deleteUserData = async () => {
    try {
      await customAxios({
        method: 'delete',
        url: `/user/${userInfo.userId}`,
      });
      dispatch(logout());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog onClose={cancleClose} open={open} maxWidth="lg">
      <CustomContent>
        <Grid
          sx={{ minWidth: 720, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <img src={imgData ? imgData : userInfo.profileImg} className={styles.profileimg} alt="" />
          <Box sx={{ position: 'absolute', bottom: 0, right: 250 }}>
            <label htmlFor="icon-button-file">
              <ProfileSearch
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={imageChange}
                ref={imgRef}
              />
              <IconButton
                aria-label="upload picture"
                component="span"
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  background: theme.palette.main,
                  height: '50px',
                  width: '50px',
                  '&:hover': {
                    background: theme.palette.main + '90',
                  },
                }}>
                <EditIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                />
              </IconButton>
            </label>
          </Box>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} container>
            <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
              <Clabel>닉네임</Clabel>
            </Grid>
            <Grid item xs={8}>
              <TInput onChange={inputNickname} sx={{ minWidth: '100%' }} value={nickname}></TInput>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <Clabel>선호언어</Clabel>
              </Grid>
              <Grid item xs={8}>
                <FormControl variant="standard" sx={{ minWidth: '100%' }}>
                  <CSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={stacks}
                    onChange={handleChange}>
                    <MenuItem value="python3">python3</MenuItem>
                    <MenuItem value="Java">Java</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="C++">C++</MenuItem>
                  </CSelect>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <Clabel>자기소개</Clabel>
          </Grid>
          <Grid item xs={10}>
            <TInput
              multiline={true}
              maxRows={4}
              sx={{ minWidth: '100%' }}
              onChange={inputIntro}
              value={introduction}></TInput>
          </Grid>
        </Grid>

        <div>
          <Clabel htmlFor="" sx={{ marginLeft: 4 }}>
            테마
          </Clabel>
          <Grid
            sx={{
              paddingTop: 1,
              display: 'flex',
              justifyContent: 'space-around',
              alignItem: 'center',
            }}>
            <ThemeButton onClick={() => setThemeSelect('basic')}>
              <img src={Basic} alt="" />
              <br />
              <label htmlFor="">기본</label>
            </ThemeButton>
            <ThemeButton onClick={() => setThemeSelect('dark')}>
              <img src={Dark} alt="" />
              <br />
              <label htmlFor="">다크</label>
            </ThemeButton>
            <ThemeButton onClick={() => setThemeSelect('olivegreen')}>
              <img src={Olivegreen} alt="" />
              <br />
              <label htmlFor="">올리브그린</label>
            </ThemeButton>
            <ThemeButton onClick={() => setThemeSelect('peachpink')}>
              <img src={Peachpink} alt="" />
              <br />
              <label htmlFor="">피치핑크</label>
            </ThemeButton>
          </Grid>
        </div>
        <Grid container>
          <Grid item xs={8}>
            <WButton onClick={deleteUserData} sx={{ height: 35, width: 50 }}>
              탈퇴
            </WButton>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              paddingTop: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItem: 'center',
            }}>
            <CButton onClick={dialogOpen} sx={{ height: 35, width: 110 }}>
              비밀번호 변경
            </CButton>
            <EditPassword open={openEditPassword} onClose={dialogClose}></EditPassword>
            <CButton onClick={editDataClose} sx={{ height: 35, width: 50 }}>
              수정
            </CButton>
          </Grid>
        </Grid>

        <IconButton
          component="span"
          sx={{ position: 'absolute', top: 40, right: 40 }}
          onClick={cancleClose}>
          <ClearIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: theme.palette.txt,
            }}
          />
        </IconButton>
      </CustomContent>
    </Dialog>
  );
}

export default EditProfile;
