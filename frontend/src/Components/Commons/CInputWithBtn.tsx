import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  styled,
  useTheme,
} from '@mui/material';
import React from 'react';
import CBtn from './CBtn';
import { BrowserView, MobileView } from 'react-device-detect';

interface CInputWithBtnProps {
  label: string;
  buttonContent: string | ReactJSXElement;
  placeholder?: string;
  isError?: boolean;
  helperText?: string;
  buttonBackgroundColor?: string;
  value?: string;
  readOnly?: boolean;
  disabled?: boolean;
  buttonDisable?: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onButtonClick: () => void;
}

const CustomGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.txt,
  height: 80,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  fontFamily: 'Pretendard-Regular',
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

function CInputWithBtn({
  label,
  buttonContent,
  placeholder = '',
  helperText = '',
  buttonBackgroundColor = '',
  isError = true,
  value,
  readOnly = false,
  disabled = false,
  buttonDisable = false,
  onChange,
  onButtonClick,
}: CInputWithBtnProps) {
  const theme = useTheme();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const onButtonClickHandler = () => {
    onButtonClick();
  };

  return (
    <>
      <BrowserView>
        <CustomGridContainer container>
          <Grid item xs={4} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
            <label htmlFor={`${label}-label`}>{label}</label>
          </Grid>
          <Grid item xs={8}>
            <FormControl variant="standard" error={!!helperText && isError} fullWidth>
              <CustomInput
                id={`${label}-label`}
                onChange={onChangeHandler}
                placeholder={placeholder}
                disabled={disabled}
                fullWidth
                value={value}
                readOnly={readOnly}
                autoComplete={label}
                endAdornment={
                  <InputAdornment position="end">
                    <CBtn
                      disabled={buttonDisable}
                      content={buttonContent}
                      height="30px"
                      width="80px"
                      backgroundColor={buttonBackgroundColor}
                      onClick={onButtonClickHandler}
                    />
                  </InputAdornment>
                }
              />
              <FormHelperText sx={{ color: theme.palette.txt }}>{helperText}</FormHelperText>
            </FormControl>
          </Grid>
        </CustomGridContainer>
      </BrowserView>
      <MobileView>
        <CustomGridContainer container>
          <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
            <label htmlFor={`${label}-label`}>{label}</label>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="standard" error={!!helperText && isError} fullWidth>
              <CustomInput
                id={`${label}-label`}
                onChange={onChangeHandler}
                placeholder={placeholder}
                disabled={disabled}
                fullWidth
                value={value}
                readOnly={readOnly}
                autoComplete={label}
                endAdornment={
                  <InputAdornment position="end">
                    <CBtn
                      disabled={buttonDisable}
                      content={buttonContent}
                      height="30px"
                      width="80px"
                      backgroundColor={buttonBackgroundColor}
                      onClick={onButtonClickHandler}
                    />
                  </InputAdornment>
                }
              />
              <FormHelperText sx={{ color: theme.palette.txt }}>{helperText}</FormHelperText>
            </FormControl>
          </Grid>
        </CustomGridContainer>
      </MobileView>
    </>
  );
}

export default CInputWithBtn;
