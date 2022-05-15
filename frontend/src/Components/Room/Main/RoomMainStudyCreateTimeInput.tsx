import { FormControl, FormHelperText, Input, styled, useTheme } from '@mui/material';
import { useRef } from 'react';
import { IMaskInput } from 'react-imask';

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

function CustomIMaskInput() {
  const ref = useRef(null);

  return (
    <IMaskInput
      mask="(\am\pm) 00:00 ~ 00:00"
      definitions={{
        '#': /[1-9]/,
      }}
      value="123"
      unmask={true}
      ref={ref}
      // inputRef={(el) => (input = el)} // access to nested input
      // DO NOT USE onChange TO HANDLE CHANGES!
      // USE onAccept INSTEAD
      onAccept={
        // depending on prop above first argument is
        // `value` if `unmask=false`,
        // `unmaskedValue` if `unmask=true`,
        // `typedValue` if `unmask='typed'`
        (value, mask) => console.log(value, mask)
      }
      placeholder="Enter number here"
    />
  );
}

interface RoomMainStudyCreateTimeInputProps {
  placeholder?: string;
  helperText?: string;
  backgroundColor?: string;
  filter?: boolean;
  filterOn?: boolean;
}

const CustomTimeInput = styled('input')(({ theme }) => ({
  '&::selection': {
    backgroundColor: 'red',
  },
  '& *::selection': {
    backgroundColor: 'red',
  },
  'input[type="time" i]::selection': {
    backgroundColor: 'red',
  },
}));

function RoomMainStudyCreateTimeInput({
  placeholder = '',
  helperText = '',
  backgroundColor,
  filter = false,
  filterOn = false,
}: RoomMainStudyCreateTimeInputProps) {
  const theme = useTheme();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const onButtonClickHandler = () => {};

  const onFilterClickHandler = () => {};

  // const onKeyUpHandler = (event: KeyboardEvent<HTMLFormElement>) => {
  //   if (event.key === 'Enter') {
  //     // 엔터키 눌렀을 때 검색실행
  //   }
  // };

  return (
    <form
      // onKeyUp={onKeyUpHandler}
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
        <CustomTimeInput type="time" />
        <CustomTimeInput type="text" />
        {/* <CustomInput inputComponent={CustomIMaskInput as any} type="time" /> */}
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </form>
  );
}

export default RoomMainStudyCreateTimeInput;
