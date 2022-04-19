import { FormControl, Grid, TextField } from '@mui/material';
import React from 'react';

interface CInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

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
    <Grid container sx={{ height: 80 }}>
      <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
        <label htmlFor={`${label}-label`}>{label}</label>
      </Grid>
      <Grid item xs={8}>
        <FormControl fullWidth>
          <TextField
            id={`${label}-label`}
            type={type}
            onChange={onChangeHandler}
            placeholder={placeholder}
            variant="standard"
            helperText={helperText}
            error={!!helperText}
            fullWidth
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default CInput;
