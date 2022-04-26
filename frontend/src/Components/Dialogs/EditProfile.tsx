import React, { useState, useRef } from 'react';
import { Dialog, Button, styled, Grid, MenuItem, FormControl, Box, Input } from '@mui/material';
import CBtn from '../Commons/CBtn';
import CInput from '../Commons/CInput';
import ProfileImg from '../../Assets/Img/Img.png';
import styles from '../Main/MainIntroductionProfile.module.css';
import Basic from '../../Assets/Img/Basic.png';
import Dark from '../../Assets/Img/Dark.png';
import Olivegreen from '../../Assets/Img/Olivegreen.png';
import Peachpink from '../../Assets/Img/Peachpink.png';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';

//탈퇴 버튼
interface WarnBtnProps {
  content: string;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  onClick: () => void;
}

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.warn,
  color: theme.palette.txt,
}));

function WarnBtn({
  content,
  backgroundColor = '',
  color = '',
  disabled = false,
  width = '',
  height = '',
  onClick,
}: WarnBtnProps) {
  return (
    <CustomButton
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        width: width,
        height: height,
      }}
      disabled={disabled}
      onClick={onClick}>
      {content}
    </CustomButton>
  );
}

//프로필 사진 선택
const ProfileSearch = styled('input')({
  display: 'none',
});

// dialog 크기 조절
const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 1200,
  minHeight: 900,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

//테마 클릭 버튼
const ThemeButton = styled('button')({
  background: 'none',
  border: 0,
  padding: 10,
  '&:hover': {
    background: '#97B2E1' + '90',
  },
});

//
export interface EditProfileProps {
  open: boolean;
  onClose: () => void;
  callback: Function;
}

function EditProfile(props: EditProfileProps) {
  const { onClose, open } = props;

  const cancleClose = () => {
    onClose();
  };
  const handleClose = () => {
    props.callback([nickname, introduction, stacks, imgData, themeSelect]);
    onClose();
  };

  // 선호 스택
  const [stacks, setStacks] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setStacks(event.target.value as string);
  };

  // 닉네임/ 자기소개
  const [nickname, setNickname] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const inputIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduction(event.target.value);
  };

  const [imgData, setImgData] = useState(null);
  const imgRef = useRef();

  const imageChange = (event: any) => {
    const reader = new FileReader();
    const file = imgRef.current.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgData(reader.result);
    };
    console.log(event.target.files[0]);
  };

  const [themeSelect, setThemeSelect] = useState('basic');

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg">
      <CustomContent>
        <Grid
          sx={{ minWidth: 900, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <img src={imgData ? imgData : ProfileImg} className={styles.profileimg} alt="" />
          <Box sx={{ position: 'absolute', bottom: 0, right: 350 }}>
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
                  mx: 'auto',
                  my: '10px',
                  px: 2.5,
                  borderRadius: '100px',
                  background: '#97B2E1',
                  height: '50px',
                  width: '50px',
                  '&:hover': {
                    background: '#97B2E1' + '90',
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
          <Grid item xs={6}>
            <CInput label="닉네임" onChange={setNickname}></CInput>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <label>선호언어</label>
              </Grid>
              <Grid item xs={8}>
                <FormControl variant="standard" sx={{ minWidth: '100%' }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={stacks}
                    onChange={handleChange}>
                    <MenuItem value="python3">python3</MenuItem>
                    <MenuItem value="Java">Java</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="C++">C++</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label>자기소개</label>
          </Grid>
          <Grid item xs={10}>
            <Input multiline={true} sx={{ minWidth: '100%' }} onChange={inputIntro}></Input>
          </Grid>
        </Grid>

        <div>
          <label htmlFor="">테마</label>
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
        <Grid
          sx={{
            paddingTop: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItem: 'center',
          }}>
          <WarnBtn content="탈퇴" onClick={handleClose}></WarnBtn>
          <CBtn content="비밀번호 변경" onClick={handleClose}></CBtn>
          <CBtn content="수정" onClick={handleClose}></CBtn>
          <IconButton
            component="span"
            sx={{ position: 'absolute', top: 40, right: 40 }}
            onClick={cancleClose}>
            <ClearIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: '#000000',
              }}
            />
          </IconButton>
        </Grid>
      </CustomContent>
    </Dialog>
  );
}

export default EditProfile;
