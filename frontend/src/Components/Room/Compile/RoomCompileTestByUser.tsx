import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBase, FormControl, InputLabel } from '@mui/material';
const CustomInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.bg,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    fontFamily: 'Pretendard-Regular',
  },
}));

const CustomLabel = styled(InputLabel)({
  '&.Mui-focused': {
    color: '#3C5FAE',
  },
});

type CompileTestByUserType = {
  setUserInput: Function;
};
function RoomCompileTestByUser({ setUserInput }: CompileTestByUserType) {
  const [input, setInput] = useState<string>('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setUserInput(event.target.value);
  };
  return (
    <div style={{ padding: '15px', width: '100%' }}>
      <FormControl variant="standard" sx={{ margin: '15px', width: 'calc(100% - 30px)' }}>
        <CustomLabel shrink htmlFor="compile-input">
          Input
        </CustomLabel>
        <CustomInput rows={7} multiline id="compile-input" value={input} onChange={handleChange} />
      </FormControl>
      <FormControl variant="standard" sx={{ margin: '15px', width: 'calc(100% - 30px)' }}>
        <CustomLabel shrink htmlFor="compile-output">
          Output
        </CustomLabel>
        <CustomInput
          inputProps={{
            readOnly: true,
          }}
          rows={7}
          multiline
          id="compile-output"
        />
      </FormControl>
    </div>
  );
}

export default RoomCompileTestByUser;
