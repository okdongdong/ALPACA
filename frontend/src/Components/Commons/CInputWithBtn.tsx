import { FormControl, FormHelperText, Grid, Input, InputAdornment } from '@mui/material';
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
    <Grid container sx={{ height: 80 }}>
      <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
        <label htmlFor={`${label}-label`}>{label}</label>
      </Grid>
      <Grid item xs={8}>
        <FormControl variant="standard" error={!!helperText} fullWidth>
          <Input
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
    </Grid>
  );
}

export default CInputWithBtn;
