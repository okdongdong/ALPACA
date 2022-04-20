import React, { useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

type selectLanguageProps = {
  selectLanguage: Function;
};
function RoomCompileSelectLanguageBtn({ selectLanguage }: selectLanguageProps) {
  const [language, setLanguage] = useState<string>('python');

  const handleChange = (event: SelectChangeEvent) => {
    selectLanguage(event.target.value);
    setLanguage(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="language-select">언어선택</InputLabel>
      <Select
        labelId="language-select"
        id="language-select"
        value={language}
        label="언어선택"
        onChange={handleChange}>
        <MenuItem value="python">Python</MenuItem>
        <MenuItem value="java">Java</MenuItem>
        <MenuItem value="cpp">C++</MenuItem>
        <MenuItem value="c">C</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoomCompileSelectLanguageBtn;
