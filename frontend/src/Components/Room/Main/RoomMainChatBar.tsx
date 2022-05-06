import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  styled,
  useTheme,
} from '@mui/material';
import React, { KeyboardEvent } from 'react';
import CBtn from '../../Commons/CBtn';
import { Send } from '@mui/icons-material';

interface CSearchBarProps {
  placeholder?: string;
  helperText?: string;
  backgroundColor?: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
}

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
}));

function RoomMainChatBar({
  placeholder = '',
  helperText = '',
  backgroundColor,
  onChange,
  onSendMessage,
}: CSearchBarProps) {
  const theme = useTheme();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const onButtonClickHandler = () => {
    onSendMessage();
  };

  const onKeyUpHandler = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      // 엔터키 눌렀을 때 검색실행
      onSendMessage();
    }
  };

  return (
    <form
      onKeyUp={onKeyUpHandler}
      onSubmit={(event) => {
        event.preventDefault();
      }}>
      <FormControl
        variant="filled"
        error={!!helperText}
        fullWidth
        sx={{
          backgroundColor: backgroundColor || theme.palette.bg,
          borderRadius: '10px',
          marginBottom: 1,
        }}>
        <CustomInput
          id="search-bar"
          onChange={onChangeHandler}
          placeholder={placeholder}
          fullWidth
          autoComplete="search-bar"
          endAdornment={
            <InputAdornment position="end">
              <CBtn
                content={<Send />}
                height="25px"
                backgroundColor="rgba(0,0,0,0)"
                onClick={onButtonClickHandler}
              />
            </InputAdornment>
          }
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </form>
  );
}

export default RoomMainChatBar;
