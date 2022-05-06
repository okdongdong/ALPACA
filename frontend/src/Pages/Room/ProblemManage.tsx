import React, { useState, useEffect } from 'react';
import { Button, Box, Avatar, AvatarGroup, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { styled, useTheme } from '@mui/material/styles';
import CBadge from '../../Components/Commons/CBadge';
import CProfile from '../../Components/Commons/CProfile';
import CBtn from '../../Components/Commons/CBtn';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { customAxios } from '../../Lib/customAxios';
import { useNavigate, useParams } from 'react-router-dom';

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
  const theme = useTheme();
  return (
    <Grid
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: '10px',
      }}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden', color: theme.palette.txt }}
              onClick={props.clearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 400,
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiInputBase-root': { color: theme.palette.txt },
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: theme.palette.main,
          },
          '& .MuiInput-underline:after': {
            borderBottom: 1,
            borderColor: theme.palette.main,
          },
        }}
      />
    </Grid>
  );
}

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  '& 	.MuiDataGrid-columnHeader': {
    color: theme.palette.txt,
  },
  '& .MuiDataGrid-sortIcon': {
    color: theme.palette.txt,
  },
  [`& .${gridClasses.row}.odd`]: {
    color: theme.palette.txt,
    backgroundColor: theme.palette.main + '90',
    '&:hover, &.Mui-hovered': {
      backgroundColor: theme.palette.main + 'C0',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.main,
    },
  },
  [`& .${gridClasses.row}.even`]: {
    color: theme.palette.txt,
    backgroundColor: theme.palette.bg,
    '&:hover, &.Mui-hovered': {
      backgroundColor: theme.palette.main + 'C0',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.main,
    },
  },
}));

function BasicMenu(props: any) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { roomId } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const goCode = (userId: number) => {
    setAnchorEl(null);
    navigate(`/codes/${props.data.problemNumber}/${userId}`, { state: roomId });
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ color: theme.palette.txt }}
        onClick={handleClick}>
        더보기
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': { background: theme.palette.component, color: theme.palette.txt },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        {props.data.solvedMemberList.map((member: any, i: number) => {
          return (
            <MenuItem
              sx={{
                width: 200,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={i}>
              <CProfile nickname={member.nickname} profileImg={member.profileImg}></CProfile>
              <CBtn
                content="코드"
                onClick={() => {
                  goCode(member.id);
                }}></CBtn>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
const columnsData = [
  {
    field: 'level',
    type: 'number',
    width: 50,
    renderCell: (params: any) => {
      return <CBadge tier={params.value}></CBadge>;
    },
  },
  { field: 'problemNumber', type: 'number', headerName: '문제 번호', width: 110 },
  { field: 'title', headerName: '문제 이름', width: 300 },
  {
    field: 'startedAt',
    headerName: '스터디 날짜',
    width: 130,
    renderCell: (params: any) => {
      return `${params.value.substring(0, 10)}`;
    },
  },
  {
    field: 'solvedMemberList',
    sortable: false,
    headerName: '문제 푼 스터디원',
    width: 300,
    renderCell: (params: any) => {
      return (
        <div
          style={{
            width: 300,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AvatarGroup
            max={5}
            spacing={1}
            sx={{
              '& .MuiAvatar-root': { width: 32, height: 32 },
            }}>
            {params.value.map((member: any, i: number) => {
              return (
                <Avatar
                  alt={member.nickname}
                  src={member.profileImg}
                  key={i}
                  sx={{
                    '& .MuiAvatar-root-MuiAvatarGroup-avatar': {
                      width: 10,
                      height: 10,
                    },
                  }}
                />
              );
            })}
          </AvatarGroup>
          <BasicMenu data={params.row}></BasicMenu>
        </div>
      );
    },
  },
];

const testdata = [
  {
    id: 1,
    level: 5,
    problemNumber: 1000,
    solvedMemberList: [
      {
        id: 1,
        nickname: 'test111',
        profileImg: '',
      },
      {
        id: 32,
        nickname: 'test11',
        profileImg: '',
      },
      {
        id: 33,
        nickname: 'test11',
        profileImg: '',
      },
      {
        id: 22,
        nickname: 'test11',
        profileImg: '',
      },
      {
        nickname: 'test22',
        profileImg: '',
      },
      {
        nickname: 'test33',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-01T08:46:48.792Z',
    title: '테스트1',
  },
  {
    id: 2,
    level: 7,
    problemNumber: 10931,
    solvedMemberList: [
      {
        nickname: 'test15',
        profileImg: '',
      },
      {
        nickname: 'test24',
        profileImg: '',
      },
      {
        nickname: 'test33',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-04T05:40:48.792Z',
    title: '테스트2',
  },
  {
    id: 3,
    level: 9,
    problemNumber: 3213,
    solvedMemberList: [
      {
        nickname: 'test71',
        profileImg: '',
      },
      {
        nickname: 'test27',
        profileImg: '',
      },
      {
        nickname: 'test5',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-04T03:40:48.792Z',
    title: '1테스트',
  },
  {
    id: 4,
    level: 10,
    problemNumber: 4800,
    solvedMemberList: [
      {
        nickname: 'test13',
        profileImg: '',
      },
      {
        nickname: 'test22',
        profileImg: '',
      },
      {
        nickname: 'test73',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-01T08:40:48.792Z',
    title: '2테스트',
  },
  {
    id: 5,
    level: 4,
    problemNumber: 3000,
    solvedMemberList: [
      {
        nickname: 'test51',
        profileImg: '',
      },
      {
        nickname: 'test21',
        profileImg: '',
      },
      {
        nickname: 'test32',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-04T08:40:48.792Z',
    title: '1번문제',
  },
  {
    id: 6,
    level: 6,
    problemNumber: 2000,
    solvedMemberList: [
      {
        nickname: 'test41',
        profileImg: '',
      },
      {
        nickname: 'test32',
        profileImg: '',
      },
      {
        nickname: 'test32',
        profileImg: '',
      },
    ],
    startedAt: '2022-05-02T08:40:48.792Z',
    title: '토스트1',
  },
];

function ProblemManage() {
  const params = useParams();
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<any[]>(testdata);
  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = testdata.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  const problemsData = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${params.roomId}/problems`,
      });
      console.log(res);
      // setRows(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    problemsData();
  }, []);

  useEffect(() => {
    setRows(testdata);
  }, [testdata]);

  return (
    <Box sx={{ height: '75vh', width: 960 }}>
      <StripedDataGrid
        disableColumnMenu
        hideFooter
        sx={{ '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'center' } }}
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        columns={columnsData}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
    </Box>
  );
}

export default ProblemManage;
