import { FormControl, FormHelperText, Grid, Input, InputAdornment, styled } from '@mui/material';
import React from 'react';
import CBtn from './CBtn';

interface CInputWithBtnProps {
  label: string;
  buttonContent: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onButtonClick: () => void;
}

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.txt,
  height: 80,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
}));

function CInputWithBtn({
  label,
  buttonContent,
  placeholder = '',
  helperText = '',
  disabled = false,
  onChange,
  onButtonClick,
}: CInputWithBtnProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const onButtonClickHandler = () => {
    onButtonClick();
  };

  return (
    <CustomGridContainer container>
      <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
        <label htmlFor={`${label}-label`}>{label}</label>
      </Grid>
      <Grid item xs={8}>
        <FormControl variant="standard" error={!!helperText} fullWidth>
          <CustomInput
            id={`${label}-label`}
            onChange={onChangeHandler}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <CBtn content={buttonContent} height="25px" onClick={onButtonClickHandler} />
              </InputAdornment>
            }
          />
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid>
    </CustomGridContainer>
  );
}

export default CInputWithBtn;
