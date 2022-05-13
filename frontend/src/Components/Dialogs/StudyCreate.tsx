import React, { useState, useEffect } from 'react';
import { Dialog, Input, DialogTitle, FormHelperText, FormControl } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import CBtn from '../Commons/CBtn';
import Chip from '@mui/material/Chip';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import alpaca from '../../Assets/Img/alpaca.png';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';

export interface StudyCreateProps {
  open: boolean;
  onClose: () => void;
  page: number;
  studyList: any;
  callback: Function;
}

interface userData {
  id: number;
  nickname: string;
  profileImg: string;
}
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

const CDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.txt,
}));

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 960,
  minHeight: 720,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

const MContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  width: '100%',
  height: '100%',
}));
const MemberArray = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  listStyle: 'none',
  padding: 0.5,
  marginTop: 20,
}));

const ListChip = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.component,
}));

function StudyCreate(props: StudyCreateProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  const myData = [
    { id: userInfo.userId, nickname: userInfo.nickname, profileImg: userInfo.profileImg },
  ];
  const [studyname, setStudyName] = useState('');
  const [studyintro, setStudyIntro] = useState('');
  const [memberList, setMemberList] = useState<any[]>(myData);
  const { onClose, open } = props;
  const [getUser, setgetUser] = useState<any>([]);
  const [nameMessage, setNameMessage] = useState<string>('');
  const [introMessage, setIntroMessage] = useState<string>('');
  const nameRegex = /^.{1,50}$/;
  const introRegex = /^.{1,500}$/;

  useEffect(() => {
    if (nameRegex.test(studyname)) {
      setNameMessage('');
    } else {
      setNameMessage('50자 이하로 입력하세요.');
    }
  }, [studyname]);

  useEffect(() => {
    if (introRegex.test(studyintro)) {
      setIntroMessage('');
    } else {
      setIntroMessage('500자 이하로 입력하세요.');
    }
  }, [studyintro]);

  const handleClose = () => {
    createData();
    setStudyName('');
    setStudyIntro('');
    setMemberList(myData);
    onClose();
  };

  const cancleClose = () => {
    setStudyName('');
    setStudyIntro('');
    setMemberList(myData);
    onClose();
  };
  const handleDelete = (chipToDelete: userData) => () => {
    if (userInfo.userId !== chipToDelete.id)
      setMemberList((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudyName(event.target.value);
  };
  const onChangeIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudyIntro(event.target.value);
  };

  const userSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    userList(event.target.value);
  };

  const createData = async () => {
    const sendList = memberList.map((data) => data.id);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study`,
        data: {
          info: studyintro,
          memberIdList: sendList,
          title: studyname,
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.studies = [...resUserInfo.studies, res.data];
      resUserInfo.studyCount += 1;
      dispatch(setUserInfo(resUserInfo));
      if (isMobile) {
        props.callback(props.page, resUserInfo.studies);
        return;
      }
      const page = Math.ceil(resUserInfo.studyCount / 3);
      searchData(page);
    } catch (e) {
      console.log(e);
    }
  };
  const searchData = async (now: number) => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study`,
        params: { page: now - 1 },
      });
      props.callback(now, res.data.content);
    } catch (e) {
      console.log(e);
    }
  };

  const userList = async (inputValue: string) => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/user/search`,
        params: { nickname: inputValue },
      });
      setgetUser(res.data);
    } catch (e: any) {
      console.log(e.response);
    }
  };

  return (
    <>
      <BrowserView style={{ width: '100%', height: '100%' }}>
        <Dialog onClose={cancleClose} open={open} maxWidth="lg">
          <CustomContent>
            <CDialogTitle sx={{ textAlign: 'center' }}>스터디 개설</CDialogTitle>
            <Grid container sx={{ minWidth: 900, display: 'flex', justifyContent: 'center' }}>
              <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <Clabel>스터디 이름</Clabel>
              </Grid>
              <Grid item xs={10}>
                <FormControl variant="standard" error={!!nameMessage} fullWidth>
                  <TInput
                    multiline={true}
                    sx={{ minWidth: '100%' }}
                    onChange={onChangeName}></TInput>
                  <FormHelperText>{nameMessage}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <Clabel>스터디 소개</Clabel>
              </Grid>
              <Grid item xs={10}>
                <FormControl variant="standard" error={!!introMessage} fullWidth>
                  <TInput
                    multiline={true}
                    sx={{ minWidth: '100%' }}
                    onChange={onChangeIntro}></TInput>
                  <FormHelperText>{introMessage}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <Clabel>스터디원</Clabel>
              </Grid>
              <Grid item xs={10}>
                <TInput onChange={userSearch} sx={{ minWidth: '100%' }}></TInput>
                <Demo>
                  <List
                    sx={{
                      position: 'relative',
                      overflow: 'auto',
                      maxHeight: 200,
                    }}>
                    {getUser.map((item: any) => {
                      return (
                        <ListItem key={item.id}>
                          <ListItemButton
                            onClick={() => {
                              setMemberList((memberList) => {
                                if (
                                  !memberList.some((samedata) => {
                                    return samedata.id === item.id;
                                  })
                                )
                                  return [...memberList, item];
                                else return [...memberList];
                              });
                            }}>
                            <ListItemAvatar>
                              <Avatar src={!!item.profileImg ? item.profileImg : alpaca} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.nickname}
                              sx={{ color: theme.palette.txt }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Demo>
                <MemberArray>
                  {memberList.map((data: any) => {
                    return (
                      <ListChip key={data.id}>
                        <CChip
                          avatar={<Avatar src={!!data.profileImg ? data.profileImg : alpaca} />}
                          label={data.nickname}
                          onDelete={handleDelete(data)}
                        />
                      </ListChip>
                    );
                  })}
                </MemberArray>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <CBtn content="닫기" onClick={cancleClose}></CBtn>
              <CBtn
                content="확인"
                onClick={handleClose}
                disabled={!!nameMessage || !!introMessage}></CBtn>
            </Grid>
          </CustomContent>
        </Dialog>
      </BrowserView>
      <MobileView>
        <Dialog onClose={cancleClose} open={open} fullScreen>
          <MContent>
            <CDialogTitle sx={{ textAlign: 'center', marginBottom: '10vh' }}>
              스터디 개설
            </CDialogTitle>
            <Grid
              container
              sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 1 }}>
              <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
                <Clabel>스터디 이름</Clabel>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" error={!!nameMessage} fullWidth>
                  <TInput multiline={true} sx={{ Width: '100%' }} onChange={onChangeName}></TInput>
                  <FormHelperText>{nameMessage}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: 1 }}>
              <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
                <Clabel>스터디 소개</Clabel>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" error={!!introMessage} fullWidth>
                  <TInput multiline={true} onChange={onChangeIntro}></TInput>
                  <FormHelperText>{introMessage}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: 1 }}>
              <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
                <Clabel>스터디원</Clabel>
              </Grid>
              <Grid item xs={12}>
                <TInput onChange={userSearch} sx={{ minWidth: '100%' }}></TInput>
                <Demo>
                  <List
                    sx={{
                      position: 'relative',
                      overflow: 'auto',
                      maxHeight: 200,
                    }}>
                    {getUser.map((item: any) => {
                      return (
                        <ListItem key={item.id}>
                          <ListItemButton
                            onClick={() => {
                              setMemberList((memberList) => {
                                if (
                                  !memberList.some((samedata) => {
                                    return samedata.id === item.id;
                                  })
                                )
                                  return [...memberList, item];
                                else return [...memberList];
                              });
                            }}>
                            <ListItemAvatar>
                              <Avatar src={!!item.profileImg ? item.profileImg : alpaca} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.nickname}
                              sx={{ color: theme.palette.txt }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Demo>
                <MemberArray>
                  {memberList.map((data: any) => {
                    return (
                      <ListChip key={data.id}>
                        <CChip
                          avatar={<Avatar src={!!data.profileImg ? data.profileImg : alpaca} />}
                          label={data.nickname}
                          onDelete={handleDelete(data)}
                        />
                      </ListChip>
                    );
                  })}
                </MemberArray>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <CBtn content="닫기" onClick={cancleClose}></CBtn>
              <CBtn
                content="확인"
                onClick={handleClose}
                disabled={!!nameMessage || !!introMessage}></CBtn>
            </Grid>
          </MContent>
        </Dialog>
      </MobileView>
    </>
  );
}

export default StudyCreate;
