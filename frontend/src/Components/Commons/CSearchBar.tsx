import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { FormControl, FormHelperText, Input, InputAdornment, styled } from '@mui/material';
import React, { KeyboardEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import CBtn from './CBtn';

interface CSearchBarProps {
  placeholder?: string;
  helperText?: string;
  buttonBackgroundColor?: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
}));

function CSearchBar({ placeholder = '', helperText = '', onChange, onSearch }: CSearchBarProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const onButtonClickHandler = () => {
    onSearch();
  };

  const onKeyUpHandler = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      // 엔터키 눌렀을 때 검색실행
      onSearch();
    }
  };

  return (
    <form
      onKeyUp={onKeyUpHandler}
      onSubmit={(event) => {
        event.preventDefault();
      }}>
      <FormControl variant="standard" error={!!helperText} fullWidth>
        <CustomInput
          id="search-bar"
          onChange={onChangeHandler}
          placeholder={placeholder}
          fullWidth
          autoComplete="search-bar"
          endAdornment={
            <InputAdornment position="end">
              <CBtn
                content={<SearchIcon />}
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

export default CSearchBar;
