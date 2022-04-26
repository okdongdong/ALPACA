import React, { useState } from 'react';
import { Dialog, styled, Grid, Input, DialogTitle } from '@mui/material';
import CBtn from '../Commons/CBtn';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface StudyCreateProps {
  open: boolean;
  onClose: () => void;
  callback: Function;
}

interface userData {
  userId: number;
  nickname: string;
}

// dialog 크기 조절
const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 1200,
  minHeight: 900,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

// 스터디원 선택
const MemberArray = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  listStyle: 'none',
  padding: 0.5,
  marginTop: 20,
}));
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function StudyCreate(props: StudyCreateProps) {
  const { onClose, open } = props;
  const cancleClose = () => {
    setStudyName('');
    setStudyIntro('');
    setMemberList([]);
    setValue(null);
    onClose();
  };

  const handleClose = () => {
    props.callback([studyname, studyintro, memberList]);
    setStudyName('');
    setStudyIntro('');
    setMemberList([]);
    setValue(null);
    onClose();
  };

  const userData = [
    { userId: 1, nickname: '강동옥' },
    { userId: 2, nickname: '김동욱' },
    { userId: 3, nickname: '김동옥' },
    { userId: 4, nickname: '강동익' },
    { userId: 5, nickname: '강동욱' },
    { userId: 6, nickname: '강옥동' },
    { userId: 7, nickname: '박준영' },
    { userId: 8, nickname: '박준형' },
    { userId: 11, nickname: '김정' },
    { userId: 23, nickname: '이현욱' },
    { userId: 45, nickname: '박조영' },
  ];
  const [memberList, setMemberList] = React.useState<any[]>([]);
  const [value, setValue] = React.useState<userData | null>(null);
  const handleDelete = (chipToDelete: userData) => () => {
    setMemberList((chips) => chips.filter((chip) => chip.userId !== chipToDelete.userId));
  };

  const [studyname, setStudyName] = useState('');
  const [studyintro, setStudyIntro] = useState('');
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudyName(event.target.value);
  };
  const onChangeIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudyIntro(event.target.value);
  };
  return (
    <Dialog onClose={handleClose} open={open} maxWidth="lg">
      <CustomContent>
        <DialogTitle sx={{ textAlign: 'center' }}>스터디 개설</DialogTitle>
        <Grid container sx={{ minWidth: 900, display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label>스터디 이름</label>
          </Grid>
          <Grid item xs={10}>
            <Input multiline={true} sx={{ minWidth: '100%' }} onChange={onChangeName}></Input>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label>스터디 소개</label>
          </Grid>
          <Grid item xs={10}>
            <Input multiline={true} sx={{ minWidth: '100%' }} onChange={onChangeIntro}></Input>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label>스터디원</label>
          </Grid>
          <Grid item xs={10}>
            <Autocomplete
              value={value}
              onChange={(event: any, newValue: userData) => {
                setValue(newValue);
                setMemberList((memberList) => {
                  if (newValue != null) {
                    if (
                      !memberList.some((samedata) => {
                        return samedata.userId === newValue.userId;
                      })
                    )
                      return [...memberList, newValue];
                  }
                  return [...memberList];
                });
              }}
              isOptionEqualToValue={(option, value) => option.nickname === value.nickname}
              id="controllable-states-demo"
              options={userData}
              getOptionLabel={(option: userData) => option.nickname}
              renderInput={(params) => <TextField {...params} variant="standard" />}
            />
            <MemberArray>
              {memberList.map((data) => {
                let icon;
                return (
                  <ListItem key={data.userId}>
                    <Chip icon={icon} label={data.nickname} onDelete={handleDelete(data)} />
                  </ListItem>
                );
              })}
            </MemberArray>
          </Grid>
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <CBtn content="닫기" onClick={cancleClose}></CBtn>
          <CBtn content="확인" onClick={handleClose}></CBtn>
        </Grid>
      </CustomContent>
    </Dialog>
  );
}

export default StudyCreate;
