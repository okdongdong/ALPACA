import { FormControl, FormHelperText, Grid, Input, styled } from '@mui/material';
import React from 'react';

interface CInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.txt,
  height: 80,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
}));

function CInput({
  label,
  placeholder = '',
  type = 'text',
  helperText = '',
  onChange,
}: CInputProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
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
            type={type}
            placeholder={placeholder}
            fullWidth
          />
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid>
    </CustomGridContainer>
  );
}

export default CInput;
