import React, { useState, useEffect } from 'react';
import { Button, Box, Avatar, AvatarGroup, Grid, Modal, Chip } from '@mui/material';
import { DataGrid, gridClasses, GridRowsProp } from '@mui/x-data-grid';
import { BrowserView, MobileView } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';
import { customAxios } from '../../Lib/customAxios';
import { styled, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CProfile from '../../Components/Commons/CProfile';
import CBadge from '../../Components/Commons/CBadge';
import CBtn from '../../Components/Commons/CBtn';
import alpaca from '../../Assets/Img/alpaca.png';

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

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const MBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.bg,
  border: `2px solid ${theme.palette.bg}`,
  padding: 4,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
}));

const MButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 1,
  right: 1,
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: 4,
  zIndex: 1,
}));

const MChip = styled(Chip)(({ theme }) => ({
  height: '1rem',
  marginLeft: '10px',
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

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
      {props.data?.solvedMemberList.length !== 0 ? (
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ color: theme.palette.txt }}
          onClick={handleClick}>
          더보기
        </Button>
      ) : (
        ''
      )}
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
              <CProfile
                nickname={member.nickname}
                profileImg={member.profileImg ? member.profileImg : alpaca}></CProfile>
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
  {
    field: 'title',
    headerName: '문제 이름',
    width: 300,
    renderCell: (params: any) => {
      if (params.row.isSolved)
        return (
          <>
            <div>
              {params.value}
              <MChip label="Solved" sx={{ height: '1rem', marginLeft: '10px' }} />
            </div>
          </>
        );
      return params.value;
    },
  },
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
                  src={member.profileImg ? member.profileImg : alpaca}
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

const McolumsData = [
  {
    field: 'level',
    type: 'number',
    flex: 1,
    renderCell: (params: any) => {
      return <CBadge tier={params.value}></CBadge>;
    },
  },
  { field: 'problemNumber', type: 'number', headerName: '문제번호', flex: 2 },
  {
    field: 'title',
    headerName: '문제 이름',
    flex: 4,
    renderCell: (params: any) => {
      if (params.row.isSolved)
        return (
          <>
            {params.value}
            <MChip label="Solved" />
          </>
        );
      return params.value;
    },
  },
  {
    field: 'startedAt',
    headerName: '스터디 날짜',
    flex: 3,
    renderCell: (params: any) => {
      return `${params.value.substring(0, 10)}`;
    },
  },
];

function ProblemManage() {
  const navigate = useNavigate();
  const params = useParams();
  const { roomId } = useParams();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [rows, setRows] = useState<any[]>(data);
  const [rowData, setRowData] = useState<any>();
  const [searchText, setSearchText] = useState('');
  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  const handleClose = () => setOpen(false);

  const problemsData = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${params.roomId}/problems`,
      });
      const rowdata: GridRowsProp = res.data;
      setData(rowdata);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    problemsData();
  }, []);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleOnClick = (nowrow: any) => {
    setRowData(nowrow);
    setOpen(true);
  };

  const goCode = (userId: number) => {
    navigate(`/codes/${rowData?.problemNumber}/${userId}`, { state: roomId });
  };

  const updateClick = async () => {
    try {
      await customAxios({
        method: 'post',
        url: `/problem`,
      });
      problemsData();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <BrowserView>
        <Box sx={{ height: '75vh', width: 960, position: 'relative' }}>
          <MButton onClick={updateClick}>Solved.ac 갱신하기</MButton>
          <StripedDataGrid
            disableColumnMenu
            hideFooter
            sx={{ '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'center' } }}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
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
      </BrowserView>
      <MobileView style={{ width: '100%', height: '100%' }}>
        <Box sx={{ height: '75vh' }}>
          <StripedDataGrid
            disableColumnMenu
            hideFooter
            sx={{
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                justifyContent: 'center',
                fontSize: '11px',
              },
            }}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            columns={McolumsData}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  requestSearch(event.target.value),
                clearSearch: () => requestSearch(''),
              },
            }}
            onRowClick={(param) => handleOnClick(param.row)}
          />
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <MBox>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CBadge tier={rowData?.level}></CBadge>
              <span>
                {rowData?.problemNumber} - {rowData?.title}
              </span>
            </div>
            {rowData?.solvedMemberList.length !== 0 ? (
              rowData?.solvedMemberList.map((member: any, i: number) => {
                return (
                  <MenuItem
                    sx={{
                      width: '50vw',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '5px',
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    key={i}>
                    <CProfile
                      nickname={member.nickname}
                      profileImg={member.profileImg ? member.profileImg : alpaca}></CProfile>
                    <CBtn
                      content="코드"
                      onClick={() => {
                        goCode(member.id);
                      }}></CBtn>
                  </MenuItem>
                );
              })
            ) : (
              <span style={{ marginTop: '10px' }}>아직 푼 스터디원이 없습니다. </span>
            )}
          </MBox>
        </Modal>
      </MobileView>
    </>
  );
}

export default ProblemManage;
