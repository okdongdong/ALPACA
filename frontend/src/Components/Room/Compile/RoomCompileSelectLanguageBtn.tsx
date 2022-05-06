import React, { useState } from 'react';
import { useTheme, Select, FormControl, InputLabel, MenuItem, styled } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';

type selectLanguageProps = {
  selectLanguage: Function;
};

function RoomCompileSelectLanguageBtn({ selectLanguage }: selectLanguageProps) {
  const theme = useTheme();
  const preferredLanguage = useSelector((state: any) => state.account.preferredLanguage);
  const [language, setLanguage] = useState<string>(
    preferredLanguage === 'python3' ? 'python' : preferredLanguage,
  );
  const handleChange = (event: SelectChangeEvent) => {
    selectLanguage(event.target.value);
    setLanguage(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel sx={{ color: theme.palette.txt }} id="language-select">
        언어선택
      </InputLabel>
      <Select
        sx={{ color: theme.palette.txt }}
        labelId="language-select"
        id="language-select"
        value={language}
        label="언어선택"
        onChange={handleChange}>
        <MenuItem value="python">Python3</MenuItem>
        <MenuItem value="java">Java</MenuItem>
        <MenuItem value="cpp">C++</MenuItem>
        <MenuItem value="c">C</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoomCompileSelectLanguageBtn;
